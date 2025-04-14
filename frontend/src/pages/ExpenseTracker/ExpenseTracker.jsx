import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getTransactions,
  createTransaction,
  createTransfer,
  resetTransactionState,
} from "../../features/transactions/transactionSlice";
import { getCategories } from "../../features/categories/categorySlice";
import { getWallets } from "../../features/wallets/walletSlice";
import ExpenseTrackerView from "./ExpenseTrackerView";
import AddTransactionForm from "../../components/AddTransactionForm";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import SuccessPopup from "../../components/Popup/SuccessPopup";
import { getGoalSavings } from "../../features/goal-saving/goalSavingSlice";

const ExpenseTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("income");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { user, isLoading: authIsLoading } = useSelector(
    (state) => state.auth || { user: null, isLoading: true }
  );
  const {
    transactions = [],
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector(
    (state) =>
      state.transactions || {
        transactions: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
      }
  );
  const { categories = [] } = useSelector(
    (state) => state.categories || { categories: [] }
  );
  const { goals = [] } = useSelector(
    (state) => state.goalSavings || { goals: [] }
  );
  const { wallets = [] } = useSelector(
    (state) => state.wallets || { wallets: [] }
  );

  const date = new Date();
  const transactionDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const initialTransactionData = {
    wallet_id: "",
    category_id: "",
    goal_id: "",
    amount: "",
    transaction_date: transactionDate,
    note: "",
    transaction_type: "Income",
  };
  const [formTransactionData, setFormTransactionData] = useState(
    initialTransactionData
  );

  const initialTransferData = {
    from_wallet_id: "",
    from_goal_id: "",
    to_wallet_id: "",
    to_goal_id: "",
    amount: "",
    transfer_date: transactionDate,
    note: "",
  };
  const [formTransferData, setFormTransferData] = useState(initialTransferData);

  useEffect(() => {
    if (user?.id) {
      console.log(
        `ExpenseTracker: Fetching initial/filtered data for user ${user.id}, month: ${selectedMonth}, year: ${selectedYear}`
      );
      dispatch(
        getTransactions({
          userId: user.id,
          month: selectedMonth,
          year: selectedYear,
        })
      );
      if (categories.length === 0) dispatch(getCategories(user.id));
      if (wallets.length === 0) dispatch(getWallets(user.id));
      if (goals.length === 0) dispatch(getGoalSavings({ userId: user.id }));
    } else if (!authIsLoading && !user) {
      navigate("/login");
    }
  }, [
    dispatch,
    user?.id,
    navigate,
    authIsLoading,
    selectedMonth,
    selectedYear,
  ]);

  useEffect(() => {
    return () => {
      console.log("ExpenseTracker unmounting, resetting transaction state.");
      dispatch(resetTransactionState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && message) {
      console.log("Transaction/Transfer successful:", message);
      setIsModalOpen(false);
      if (message.toLowerCase().includes("transfer")) {
        setFormTransferData(initialTransferData);
      } else {
        setFormTransactionData(initialTransactionData);
      }
      setErrors({});
      if (user?.id) {
        console.log("Refetching transactions after success with filter...");
        dispatch(
          getTransactions({
            userId: user.id,
            month: selectedMonth,
            year: selectedYear,
          })
        );
        if (message.toLowerCase().includes("transfer")) {
          dispatch(getWallets(user.id));
          dispatch(getGoalSavings({ userId: user.id }));
        }
      }
    }
  }, [isSuccess, message, dispatch, user?.id, selectedMonth, selectedYear]);

  useEffect(() => {
    if (isError && message) {
      console.error("Transaction/Transfer error:", message);
      setErrors((prev) => ({ ...prev, server: message }));
      dispatch(resetTransactionState());
    }
  }, [isError, message, dispatch]);

  const handleFormChange = (e, formType) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "amount") {
      processedValue = value === "" ? "" : value;
    } else if (name.includes("_id") && value !== "") {
      processedValue = Number(value);
      if (isNaN(processedValue)) processedValue = "";
    } else if (name.includes("_id") && value === "") {
      processedValue = "";
    }

    if (formType === "transfer") {
      setFormTransferData((prev) => ({ ...prev, [name]: processedValue }));
    } else {
      setFormTransactionData((prev) => ({
        ...prev,
        [name]: processedValue,
        transaction_type: activeTab === "income" ? "Income" : "Expense",
      }));
    }
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    if (errors.server) {
      setErrors((prevErrors) => ({ ...prevErrors, server: null }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (activeTab === "transfer") {
      const data = formTransferData;
      const amountNumber = parseFloat(data.amount);

      if (
        (!data.from_wallet_id && !data.from_goal_id) ||
        (data.from_wallet_id && data.from_goal_id)
      ) {
        isValid = false;
        newErrors.from_wallet_id =
          "Pilih satu sumber (Dompet atau Tujuan Menabung).";
        newErrors.from_goal_id = " ";
      }
      if (
        (!data.to_wallet_id && !data.to_goal_id) ||
        (data.to_wallet_id && data.to_goal_id)
      ) {
        isValid = false;
        newErrors.to_wallet_id =
          "Pilih satu tujuan (Dompet atau Tujuan Menabung).";
        newErrors.to_goal_id = " ";
      }

      if (
        data.from_wallet_id &&
        data.to_wallet_id &&
        data.from_wallet_id === data.to_wallet_id
      ) {
        isValid = false;
        newErrors.to_wallet_id = "Tidak bisa transfer ke dompet yang sama.";
      }
      if (
        data.from_goal_id &&
        data.to_goal_id &&
        data.from_goal_id === data.to_goal_id
      ) {
        isValid = false;
        newErrors.to_goal_id =
          "Tidak bisa transfer ke tujuan menabung yang sama.";
      }

      if (data.amount === "" || isNaN(amountNumber) || amountNumber <= 0) {
        isValid = false;
        newErrors.amount = "Jumlah transfer harus angka positif.";
      }
    } else {
      const data = formTransactionData;
      const amountNumber = parseFloat(data.amount);

      if (!data.wallet_id) {
        isValid = false;
        newErrors.wallet_id = "Dompet wajib dipilih.";
      }
      if (!data.category_id) {
        isValid = false;
        newErrors.category_id = "Kategori wajib dipilih.";
      }
      if (data.amount === "" || isNaN(amountNumber) || amountNumber <= 0) {
        isValid = false;
        newErrors.amount = "Jumlah transaksi harus angka positif.";
      }

      if (!data.transaction_date) {
        isValid = false;
        newErrors.transaction_date = "Tanggal transaksi wajib diisi.";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    setErrors({});

    if (!validateForm()) {
      console.log("Form validation failed.");
      return;
    }

    let payload = {};
    let actionToDispatch = null;

    if (activeTab === "transfer") {
      payload = {
        from_wallet_id: formTransferData.from_wallet_id || null,
        from_goal_id: formTransferData.from_goal_id || null,
        to_wallet_id: formTransferData.to_wallet_id || null,
        to_goal_id: formTransferData.to_goal_id || null,
        amount: parseFloat(formTransferData.amount),
        transfer_date: formTransferData.transfer_date,
        note: formTransferData.note || null,
      };
      actionToDispatch = createTransfer({
        userId: user.id,
        transferData: payload,
      });
      console.log("Dispatching createTransfer:", payload);
    } else {
      payload = {
        wallet_id: Number(formTransactionData.wallet_id),
        category_id: Number(formTransactionData.category_id),
        goal_id: Number(formTransactionData.goal_id) || null,
        amount: parseFloat(formTransactionData.amount),
        transaction_date: formTransactionData.transaction_date,
        note: formTransactionData.note || null,
        transaction_type: activeTab === "income" ? "Income" : "Expense",
      };
      actionToDispatch = createTransaction({
        userId: user.id,
        transactionData: payload,
      });
      console.log("Dispatching createTransaction:", payload);
    }

    dispatch(resetTransactionState());
    dispatch(actionToDispatch);
  };

  const handleMonthChange = (month, year) => {
    console.log(`Filter changed to: Month ${month}, Year ${year}`);
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const safeTransactions = useMemo(
    () => (Array.isArray(transactions) ? transactions : []),
    [transactions]
  );
  const filteredTransactions = useMemo(() => {
    return safeTransactions
      .map((tx, index) => ({ ...tx, no: index + 1 }))
      .filter((tx) => {
        const search = searchTerm.toLowerCase();
        if (!search) return true;
        const walletName = tx.wallet?.wallet_name?.toLowerCase() || "";
        const categoryName = tx.category?.category_name?.toLowerCase() || "";
        const date = tx.transaction_date?.toLowerCase() || "";
        const note = tx.note?.toLowerCase() || "";
        const amountStr = tx.amount?.toString().toLowerCase() || "";
        return (
          walletName.includes(search) ||
          categoryName.includes(search) ||
          date.includes(search) ||
          note.includes(search) ||
          amountStr.includes(search)
        );
      });
  }, [safeTransactions, searchTerm]);

  return (
    <>
      <ExpenseTrackerView
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsModalOpen={setIsModalOpen}
        transactionsToDisplay={filteredTransactions}
        isLoading={isLoading && transactions.length === 0 && !isError}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
      />
      <AddTransactionForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setErrors({});
          setFormTransactionData(initialTransactionData);
          setFormTransferData(initialTransferData);
          if (isError) dispatch(resetTransactionState());
        }}
        formData={
          activeTab === "transfer" ? formTransferData : formTransactionData
        }
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wallets={wallets || []}
        goals={goals || []}
        categories={categories || []}
        isLoading={isLoading}
        errors={errors}
      />
      {isSuccess && message && (
        <SuccessPopup
          isOpen={isSuccess}
          onClose={() => dispatch(resetTransactionState())}
          successMessage={message}
        />
      )}
    </>
  );
};

export default ExpenseTracker;
