import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getBudgets,
  createBudget,
  updateBudget, 
  resetBudgetState,
} from "../../features/budgets/budgetSlice";
import { getCategories } from "../../features/categories/categorySlice";
import SmartBudgetingView from "./SmartBudgetingView";
import Modal from "../../components/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";

const SmartBudgeting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [currentBudget, setCurrentBudget] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    period: "Monthly",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { budgets, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.budgets
  );
  const { categories: availableCategories } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (!user?.id) {
      console.log("User ID tidak ditemukan.");
      navigate("/login");
      return;
    }
    dispatch(getBudgets(user.id));
    if (!availableCategories || availableCategories.length === 0) {
      dispatch(getCategories(user.id));
    }
  }, [dispatch, user?.id, navigate, availableCategories]);

  useEffect(() => {
    if (isError) {
      alert(`Error: ${message}`);
      dispatch(resetBudgetState());
    }
    if (isSuccess && message) {
      setIsModalOpen(false);
      setFormData({ category_id: "", amount: "", period: "Monthly" });
      setCurrentBudget(null); 
      setModalMode("add"); 
      alert(message);
      dispatch(resetBudgetState());
    }
  }, [isError, isSuccess, message, dispatch]);

  const safeBudgets = useMemo(
    () => (Array.isArray(budgets) ? budgets : []),
    [budgets]
  );

  const budgetSummary = useMemo(() => {
    const totalTarget = safeBudgets.reduce(
      (sum, budget) => sum + (budget.amount || 0),
      0
    );
    const totalCurrent = safeBudgets.reduce(
      (sum, budget) => sum + (budget.spent_amount || 0),
      0
    );
    const sisa = totalTarget - totalCurrent;
    const percentage =
      totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
    return {
      totalAnggaran: totalTarget,
      totalTercapai: totalCurrent,
      sisaAnggaran: sisa,
      persentase: percentage > 100 ? 100 : percentage,
    };
  }, [safeBudgets]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = safeBudgets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(safeBudgets.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = () => {
    setModalMode("add"); 
    setCurrentBudget(null); 
    setFormData({ category_id: "", amount: "", period: "Monthly" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (budget) => {
    setModalMode("edit"); 
    setCurrentBudget(budget); 
    setFormData({
      category_id: budget.category_id || "",
      amount: budget.amount || "",
      period: budget.period || "Monthly",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBudget(null); 
    setModalMode("add"); 
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        name === "amount" || name === "category_id"
          ? parseFloat(value) || ""
          : value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!user?.id) return;

    if (!formData.category_id || !formData.amount) {
      alert("Kategori dan Jumlah Anggaran wajib diisi.");
      return;
    }

    let budgetData = {};
    if (modalMode === "add") {
      budgetData = {
        category_id: Number(formData.category_id),
        amount: parseFloat(formData.amount),
        period: formData.period,
        wallet_id: 1, 
      };
      console.log("Submitting create budget data:", budgetData);
      dispatch(createBudget({ userId: user.id, budgetData }));
    } else if (modalMode === "edit" && currentBudget) {
      budgetData = {
        amount: parseFloat(formData.amount),
        period: formData.period,
      };
      console.log("Submitting update budget data:", budgetData);
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
    if (typeof value !== "number") return "Rp. -";
    if (value >= 1000000000) {
      return `Rp. ${(value / 1000000000).toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })} M`;
    } else if (value >= 1000000) {
      return `Rp. ${(value / 1000000).toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })} jt`;
    } else {
      return `Rp. ${value.toLocaleString("id-ID")}`;
    }
  };

  return (
    <>
      <SmartBudgetingView
        isLoading={isLoading}
        currentItems={currentItems}
        formatCurrencyShort={formatCurrencyShort}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        openModal={openModal} 
        onEditBudget={handleOpenEditModal}
        totalAnggaran={budgetSummary.totalAnggaran}
        totalTercapai={budgetSummary.totalTercapai}
        sisaAnggaran={budgetSummary.sisaAnggaran}
        persentaseAnggaran={budgetSummary.persentase}
      />

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
        submitLabel={modalMode === "add" ? "Tambah" : "Simpan Perubahan"} // <-- Label tombol dinamis
      >
        <>
          <div className="mb-4 relative">
            <label htmlFor="category_id" className="block text-sm font-medium">
              Kategori
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleFormChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 appearance-none pr-8 bg-white mt-2 ${
                formData.category_id === "" ? "text-gray-400" : "text-gray-900"
              }`}
              required
              disabled={isLoading || modalMode === "edit"}
            >
              <option value="" disabled>
                Pilih Kategori...
              </option>
              {availableCategories &&
                availableCategories
                  .filter((cat) => cat.category_type === "Expense")
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}
            </select>
            <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none">
              <Icon
                icon="heroicons:chevron-down"
                className="text-gray-500 h-4 w-4"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium">
              Jumlah Anggaran
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleFormChange}
              placeholder="Rp 0.00"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mt-2"
              required
              min="0"
              disabled={isLoading}
            />
          </div>
        </>
      </Modal>
    </>
  );
};

export default SmartBudgeting;
