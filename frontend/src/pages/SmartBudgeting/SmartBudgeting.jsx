import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getBudgets,
  createBudget,
  updateBudget, // Pastikan sudah diimport jika ada fitur edit
  resetBudgetState,
} from "../../features/budgets/budgetSlice";
import { getCategories } from "../../features/categories/categorySlice";
import { getWallets } from "../../features/wallets/walletSlice"; // Pastikan import dan slice ada
import SmartBudgetingView from "./SmartBudgetingView";
import Modal from "../../components/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";

const SmartBudgeting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentBudget, setCurrentBudget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Initial state form HARUS menyertakan wallet_id
  const initialFormData = {
    category_id: "",
    amount: "",
    period: "Monthly", // Default periode
    wallet_id: "", // <-- Tambahkan/Pastikan ada
  };
  const [formData, setFormData] = useState(initialFormData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil state dari Redux
  const { user } = useSelector((state) => state.auth);
  const {
    budgets = [],
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.budgets);
  const { categories: availableCategories = [] } = useSelector(
    (state) => state.categories
  );
  const { wallets = [] } = useSelector(
    // Ambil state wallets
    (state) => state.wallets
  );

  // Fetch data awal
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }
    dispatch(getBudgets(user.id));
    // Fetch data referensi jika belum ada
    if (availableCategories.length === 0) {
      dispatch(getCategories(user.id));
    }
    if (wallets.length === 0) {
      // <-- Fetch wallets jika belum ada
      dispatch(getWallets(user.id));
    }

    dispatch(resetBudgetState());
    return () => {
      dispatch(resetBudgetState());
    };
  }, [dispatch, user?.id, navigate]); // Hanya jalankan saat user berubah

  // Efek handle sukses/error CUD
  useEffect(() => {
    if (isError) {
      alert(`Error: ${message}`);
      dispatch(resetBudgetState());
    }
    if (isSuccess && message) {
      setIsModalOpen(false);
      setFormData(initialFormData); // Reset form ke state awal
      setCurrentBudget(null);
      setModalMode("add");
      alert(message);
      // Fetch ulang data budgets setelah CUD sukses
      if (user?.id) {
        dispatch(getBudgets(user.id));
      }
      dispatch(resetBudgetState());
    }
  }, [isError, isSuccess, message, dispatch, user?.id, initialFormData]); // Dependensi

  // Kalkulasi data untuk view
  const safeBudgets = useMemo(
    () => (Array.isArray(budgets) ? budgets : []),
    [budgets]
  );
  const budgetSummary = useMemo(() => {
    const safeBudgets = Array.isArray(budgets) ? budgets : []; // Hitung di sini jika belum

    const totalTarget = safeBudgets.reduce(
      (sum, budget) => sum + (Number(budget.amount) || 0),
      0
    ); // Pastikan Number
    const totalCurrent = safeBudgets.reduce(
      (sum, budget) => sum + (Number(budget.spent_amount) || 0),
      0
    ); // Pastikan Number

    // --- LOG DI SINI ---
    console.log("[Budget Summary Calc] safeBudgets:", safeBudgets);
    console.log(
      "[Budget Summary Calc] totalTarget:",
      totalTarget,
      typeof totalTarget
    );
    console.log(
      "[Budget Summary Calc] totalCurrent (totalTerpakai):",
      totalCurrent,
      typeof totalCurrent
    );
    // ---

    const sisa = totalTarget - totalCurrent;
    // Perbaiki penanganan NaN eksplisit
    const percentage =
      totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
    // Jika hasilnya NaN (misal 0/0), default ke 0. Batasi juga maks 100.
    const finalPercentage = isNaN(percentage) ? 0 : Math.min(100, percentage);

    console.log("[Budget Summary Calc] Calculated Percentage:", percentage);
    console.log("[Budget Summary Calc] Final Percentage:", finalPercentage);

    return {
      totalAnggaran: totalTarget,
      totalTerpakai: totalCurrent,
      sisaAnggaran: sisa,
      persentase: finalPercentage, // Kirim hasil yg sudah dicek NaN
    };
    // }, [safeBudgets]); // Dependensi cukup safeBudgets
  }, [budgets]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = safeBudgets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(safeBudgets.length / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Modal & Form Handlers
  const openModal = () => {
    setModalMode("add");
    setCurrentBudget(null);
    setFormData(initialFormData); // Reset form saat buka modal tambah
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (budget) => {
    setModalMode("edit");
    setCurrentBudget(budget);
    // Isi form termasuk wallet_id saat edit
    setFormData({
      category_id: budget.category_id || "",
      amount: budget.amount || "",
      period: budget.period || "Monthly",
      wallet_id: budget.wallet_id || "", // <-- Isi wallet_id
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBudget(null);
    setModalMode("add");
    setFormData(initialFormData); // Reset form saat tutup
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // Konversi ke angka untuk amount dan ID, biarkan string kosong jika input kosong
    // Atau null jika value kosong untuk ID (handleFormChange sebelumnya sudah benar)
    const processedValue =
      name === "amount" || name.includes("_id")
        ? value === ""
          ? ""
          : Number(value)
        : value;
    if (name === "amount" && isNaN(processedValue)) {
      // Jika amount diisi teks, jangan update state numbernya
      setFormData((prevState) => ({ ...prevState, [name]: value })); // Biarkan string di state sementara
    } else if (name.includes("_id") && value === "") {
      setFormData((prevState) => ({ ...prevState, [name]: "" })); // Biarkan string kosong untuk ID
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: processedValue }));
    }
  };

  // Handler Submit Form
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!user?.id) return;

    // Validasi frontend
    if (
      !formData.category_id ||
      !formData.amount ||
      !formData.wallet_id ||
      !formData.period
    ) {
      alert("Dompet, Kategori, Jumlah Anggaran, dan Periode wajib diisi.");
      return;
    }
    const amountFloat = parseFloat(formData.amount);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      alert("Jumlah anggaran harus angka positif.");
      return;
    }
    const walletIdNumber = Number(formData.wallet_id);
    if (isNaN(walletIdNumber) || walletIdNumber <= 0) {
      alert("Pilihan Dompet tidak valid.");
      return;
    }
    const categoryIdNumber = Number(formData.category_id);
    if (isNaN(categoryIdNumber) || categoryIdNumber <= 0) {
      alert("Pilihan Kategori tidak valid.");
      return;
    }

    let budgetData = {};
    if (modalMode === "add") {
      budgetData = {
        category_id: categoryIdNumber,
        amount: amountFloat,
        period: formData.period,
        wallet_id: walletIdNumber, // <-- Kirim wallet_id dari formData
        // start_date akan dihandle backend jika period bukan Daily
      };
      console.log("Submitting create budget data:", budgetData);
      dispatch(createBudget({ userId: user.id, budgetData }));
    } else if (modalMode === "edit" && currentBudget) {
      // Saat edit, biasanya backend HANYA menerima amount dan period
      // (Wallet & Kategori tidak bisa diubah untuk budget yg ada)
      budgetData = {
        amount: amountFloat,
        period: formData.period,
        // Jika backend BISA update field lain, tambahkan di sini:
        // category_id: categoryIdNumber, // Biasanya tidak diubah
        // wallet_id: walletIdNumber,   // Biasanya tidak diubah
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
        totalTerpakai={budgetSummary.totalTerpakai}
        sisaAnggaran={budgetSummary.sisaAnggaran}
        persentaseTotal={budgetSummary.persentase}
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
            <label
              htmlFor="wallet_id"
              className="block text-sm font-medium text-gray-700"
            >
              Anggaran untuk Dompet
            </label>
            <select
              id="wallet_id"
              name="wallet_id"
              value={formData.wallet_id || ""}
              onChange={handleFormChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              disabled={isLoading || wallets.length === 0}
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
