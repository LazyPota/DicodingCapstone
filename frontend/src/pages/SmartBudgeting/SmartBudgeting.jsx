import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getBudgets,
  createBudget,
  updateBudget,
  resetBudgetState,
  resetBudgetsAndPagination, 
} from "../../features/budgets/budgetSlice";
import { getCategories } from "../../features/categories/categorySlice";
import { getWallets } from "../../features/wallets/walletSlice";
import SmartBudgetingView from "./SmartBudgetingView";
import Modal from "../../components/Modal";
import SuccessPopup from "../../components/Popup/SuccessPopup"; 
import UpdatePopup from "../../components/Popup/UpdatePopup"; 
import { Icon } from "@iconify/react/dist/iconify.js";

const SmartBudgeting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentBudget, setCurrentBudget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 6; 
  const [errors, setErrors] = useState({}); 

  const currentMonth = new Date().getMonth() + 1; 
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const initialFormData = {
    category_id: "",
    amount: "",
    period: "Monthly",
    wallet_id: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    budgets = [], paginationInfo, isLoading, isError, isSuccess, message,
  } = useSelector((state) => state.budgets);
  const { categories: availableCategories = [] } = useSelector((state) => state.categories);
  const { wallets = [] } = useSelector((state) => state.wallets);

  useEffect(() => {
    if (!user?.id) {
      console.log("useEffect Main Fetch: No user ID yet. Waiting or navigating.");
      return; 
    }
    console.log(`useEffect Main Fetch: Fetching budgets for user ${user.id}, page ${currentPage}, month ${selectedMonth}, year ${selectedYear}`);
    dispatch(getBudgets({
        userId: user.id,
        page: currentPage,
        perPage: itemsPerPage,
        month: selectedMonth,
        year: selectedYear,
     }));
    if (availableCategories.length === 0) {
      console.log("useEffect Main Fetch: Fetching categories.");
      dispatch(getCategories(user.id));
    }
    if (wallets.length === 0) {
      console.log("useEffect Main Fetch: Fetching wallets.");
      dispatch(getWallets(user.id));
    }
    return () => {
      console.log("SmartBudgeting unmounting or deps changed, resetting budgets and pagination.");
      dispatch(resetBudgetsAndPagination());
    };
  }, [dispatch, user?.id, navigate, currentPage, selectedMonth, selectedYear, itemsPerPage]); 

  useEffect(() => { 
     if (isError && message) {
        console.error("Budget operation error:", message);
        setErrors(prev => ({ ...prev, server: message }));
     }
   }, [isError, message, dispatch]);

  useEffect(() => {
    if (isSuccess && message) {
      console.log("Budget operation successful:", message);
      setIsModalOpen(false);
      setFormData(initialFormData);
      setCurrentBudget(null);
      setModalMode("add");
      setErrors({});

      const pageToFetchAfterSuccess = message.includes("ditambahkan") ? 1 : currentPage;

      if (pageToFetchAfterSuccess !== currentPage) {
        console.log("Success Effect: Setting page to trigger refetch:", pageToFetchAfterSuccess);
        setCurrentPage(pageToFetchAfterSuccess);
      } else {
         if (user?.id) {
             console.log("Success Effect: Refetching current page:", currentPage);
             dispatch(getBudgets({
                userId: user.id,
                page: currentPage,
                perPage: itemsPerPage,
                month: selectedMonth,
                year: selectedYear,
             }));
         }
      }
    }
  }, [isSuccess, message, dispatch, user?.id, currentPage, selectedMonth, selectedYear, itemsPerPage]);

  const safeBudgets = useMemo(
    () => (Array.isArray(budgets) ? budgets : []),
    [budgets]
  );
  const budgetSummary = useMemo(() => {
    const totalTarget = safeBudgets.reduce(
      (sum, budget) => sum + (Number(budget.amount) || 0),
      0
    );
    const totalCurrent = safeBudgets.reduce(
      (sum, budget) => sum + (Number(budget.spent_amount) || 0),
      0
    );
    const sisa = totalTarget - totalCurrent;
    const percentage =
      totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
    const finalPercentage = isNaN(percentage) ? 0 : Math.min(100, percentage);
    return {
      totalAnggaran: totalTarget,
      totalTerpakai: totalCurrent,
      sisaAnggaran: sisa,
      persentase: finalPercentage,
    };
  }, [safeBudgets]); 

  const totalPages = paginationInfo?.total_pages || 1;

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      console.log("Changing page to:", page);
      setCurrentPage(page);
    }
  };

  const handleMonthChange = (month, year) => {
    console.log(`Filter changed to: Month ${month}, Year ${year}`);
    setSelectedMonth(month);
    setSelectedYear(year);
    setCurrentPage(1); 
  };

  const openModal = () => {
    setModalMode("add");
    setCurrentBudget(null);
    setFormData(initialFormData);
    setErrors({}); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (budget) => {
    setModalMode("edit");
    setCurrentBudget(budget);
    setFormData({
      category_id: budget.category_id || "",
      amount: budget.amount || "",
      period: budget.period || "Monthly",
      wallet_id: budget.wallet_id || "",
    });
    setErrors({}); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBudget(null);
    setModalMode("add");
    setFormData(initialFormData);
    setErrors({});
    if (isError) {
      dispatch(resetBudgetState());
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    if (errors.server) {
      setErrors((prevErrors) => ({ ...prevErrors, server: null }));
      if (isError) dispatch(resetBudgetState());
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!formData.category_id) {
      formIsValid = false;
      newErrors.category_id = "Kategori wajib dipilih.";
    }
    if (!formData.wallet_id && modalMode === "add") {

      formIsValid = false;
      newErrors.wallet_id = "Dompet wajib dipilih.";
    }
    if (
      formData.amount === "" ||
      formData.amount === null ||
      isNaN(Number(formData.amount))
    ) {
      formIsValid = false;
      newErrors.amount = "Jumlah anggaran wajib diisi angka.";
    } else if (Number(formData.amount) <= 0) {
      formIsValid = false;
      newErrors.amount = "Jumlah anggaran harus lebih dari 0.";
    }
    if (!formData.period) {
      // Check period
      formIsValid = false;
      newErrors.period = "Periode wajib dipilih.";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!user?.id) return;

    // VALIDATE FIRST
    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    const amountFloat = parseFloat(formData.amount);
    const walletIdNumber = Number(formData.wallet_id);
    const categoryIdNumber = Number(formData.category_id);

    let budgetData = {};
    if (modalMode === "add") {
      budgetData = {
        category_id: categoryIdNumber,
        amount: amountFloat,
        period: formData.period,
        wallet_id: walletIdNumber,
      };
      console.log("Submitting create budget data:", budgetData);
      dispatch(createBudget({ userId: user.id, budgetData }));
    } else if (modalMode === "edit" && currentBudget) {
      budgetData = {
        amount: amountFloat,
        period: formData.period,
      };
      console.log(
        "Submitting update budget data:",
        budgetData,
        "for ID:",
        currentBudget.id
      );
      dispatch(
        updateBudget({
          userId: user.id,
          budgetId: currentBudget.id,
          budgetData,
        })
      );
    }
  };

  const formatCurrencyShort = (value) => {
    /* ... */
    if (typeof value !== "number" || isNaN(value)) return "Rp. 0"; // Handle NaN/non-number
    if (value >= 1000000000)
      return `Rp. ${(value / 1000000000).toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })} M`;
    if (value >= 1000000)
      return `Rp. ${(value / 1000000).toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })} jt`;
    return `Rp. ${value.toLocaleString("id-ID")}`;
  };

  return (
    <>
      <SmartBudgetingView
        isLoading={isLoading}
        currentItems={budgets}
        formatCurrencyShort={formatCurrencyShort}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        openModal={openModal}
        onEditBudget={handleOpenEditModal}
        totalAnggaran={budgetSummary.totalAnggaran}
        totalTerpakai={budgetSummary.totalTerpakai}
        sisaAnggaran={budgetSummary.sisaAnggaran}
        persentaseTotal={budgetSummary.persentase}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
      />

      {/* Modal now renders children with validation errors */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalMode === "add"
            ? "Tambah Rencana Anggaran"
            : "Edit Rencana Anggaran"
        }
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        submitLabel={modalMode === "add" ? "Tambah" : "Simpan Perubahan"}
      >
        {/* Form Content */}
        <>
          {/* Display Server Error Inside Modal */}
          {errors.server && (
            <p className="text-red-500 text-xs mb-3 text-center">
              {errors.server}
            </p>
          )}

          {/* Kategori Input */}
          <div className="mb-4 relative">
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Kategori{" "}
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleFormChange}
              // Add error styling
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm appearance-none pr-8 bg-white ${
                errors.category_id
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              } ${
                formData.category_id === "" ? "text-gray-400" : "text-gray-900"
              }`}
              required
              disabled={isLoading || modalMode === "edit"} // Disable edit category/wallet
              aria-invalid={errors.category_id ? "true" : "false"}
              aria-describedby={
                errors.category_id ? "category_id-error" : undefined
              }
            >
              <option value="" disabled>
                {" "}
                Pilih Kategori...{" "}
              </option>
              {availableCategories &&
                availableCategories
                  .filter((cat) => cat.category_type === "Expense")
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {" "}
                      {cat.category_name}{" "}
                    </option>
                  ))}
            </select>
            <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none">
              <Icon
                icon="heroicons:chevron-down"
                className="text-gray-500 h-4 w-4"
              />
            </div>
            {/* Show validation error */}
            {errors.category_id && (
              <p id="category_id-error" className="text-red-500 text-xs mt-1">
                {errors.category_id}
              </p>
            )}
          </div>

          {/* Dompet Input */}
          <div className="mb-4">
            <label
              htmlFor="wallet_id"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Anggaran untuk Dompet{" "}
            </label>
            <select
              id="wallet_id"
              name="wallet_id"
              value={formData.wallet_id || ""}
              onChange={handleFormChange}
              // Add error styling
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                errors.wallet_id
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              required
              disabled={isLoading || modalMode === "edit"} // Disable edit category/wallet
              aria-invalid={errors.wallet_id ? "true" : "false"}
              aria-describedby={
                errors.wallet_id ? "wallet_id-error" : undefined
              }
            >
              <option value="" disabled>
                {wallets.length === 0
                  ? "Memuat/Tidak ada dompet"
                  : "Pilih Dompet..."}
              </option>
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.wallet_name} (Rp{" "}
                  {wallet.amount?.toLocaleString("id-ID") || 0})
                </option>
              ))}
            </select>
            {/* Show validation error */}
            {errors.wallet_id && (
              <p id="wallet_id-error" className="text-red-500 text-xs mt-1">
                {errors.wallet_id}
              </p>
            )}
          </div>

          {/* Jumlah Anggaran Input */}
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Jumlah Anggaran{" "}
            </label>
            <input
              id="amount"
              name="amount"
              type="number" // Use number for better input handling on mobile/validation
              value={formData.amount} // Controlled component
              onChange={handleFormChange}
              placeholder="0"
              // Add error styling
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                errors.amount
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              required
              min="0" // Min value
              step="any" // Allow decimals if needed
              disabled={isLoading}
              aria-invalid={errors.amount ? "true" : "false"}
              aria-describedby={errors.amount ? "amount-error" : undefined}
            />
            {/* Show validation error */}
            {errors.amount && (
              <p id="amount-error" className="text-red-500 text-xs mt-1">
                {errors.amount}
              </p>
            )}
          </div>

          {/* Periode Input */}
          <div className="mb-4">
            <label
              htmlFor="period"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Periode{" "}
            </label>
            <select
              id="period"
              name="period"
              value={formData.period}
              onChange={handleFormChange}
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                errors.period
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              required
              disabled={isLoading}
              aria-invalid={errors.period ? "true" : "false"}
              aria-describedby={errors.period ? "period-error" : undefined}
            >
              <option value="Monthly">Bulanan</option>
              <option value="Yearly">Tahunan</option>
              {/* Add other periods if needed */}
            </select>
            {errors.period && (
              <p id="period-error" className="text-red-500 text-xs mt-1">
                {errors.period}
              </p>
            )}
          </div>
        </>
      </Modal>

      {/* Render Popups Conditionally */}
      {isSuccess && message?.includes("ditambahkan") && (
        <SuccessPopup
          isOpen={isSuccess}
          onClose={() => dispatch(resetBudgetState())}
          successMessage={message}
        />
      )}
      {isSuccess && message?.includes("diperbarui") && (
        <UpdatePopup
          isOpen={isSuccess}
          onClose={() => dispatch(resetBudgetState())}
          // Pass message to UpdatePopup
          updateMessage={message}
        />
      )}
    </>
  );
};

export default SmartBudgeting;
