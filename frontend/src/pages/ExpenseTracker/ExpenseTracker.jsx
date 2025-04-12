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
import { getGoalSavings } from "../../features/goal-saving/goalSavingSlice";
import { store } from "../../app/store";
import { initialState } from "../../features/transactions/transactionSlice";

const ExpenseTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("income");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || { user: null });
  const {
    transactions = [],
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.transactions || initialState);
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
  const transactionDate = `${date.getDate().toString().padStart(2, "0")}-${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
  const [formTransactionData, setFormTransactionData] = useState({
    wallet_id: "",
    category_id: "",
    goal_id: "",
    amount: "",
    transaction_date: transactionDate,
    note: "",
    transaction_type: "Income",
  });

  const [formTransferData, setFormTransferData] = useState({
    from_wallet_id: null,
    from_goal_id: null,
    to_wallet_id: null,
    to_goal_id: null,
    amount: "",
    transfer_date: transactionDate,
    note: "",
  });
  useEffect(() => {
    if (user?.id) {
      console.log("User ID found, dispatching initial fetches...");
      dispatch(getTransactions(user.id));
      const currentState = store.getState();

      if (
        !currentState.categories?.categories ||
        currentState.categories.categories.length === 0
      ) {
        console.log("Dispatching getCategories...");
        dispatch(getCategories(user.id));
      }
      if (
        !currentState.wallets?.wallets ||
        currentState.wallets.wallets.length === 0
      ) {
        console.log("Dispatching getWallets...");
        dispatch(getWallets(user.id));
      }
      if (
        !currentState.goalSavings?.goals ||
        currentState.goalSavings.goals.length === 0
      ) {
        console.log("Dispatching getGoalSavings...");
        dispatch(getGoalSavings(user.id));
      }
    } else {
      console.log("User ID not found on mount/update, redirecting...");
      navigate("/login");
    }

    return () => {
      console.log("ExpenseTracker unmounting, resetting transaction state.");
      dispatch(resetTransactionState());
    };
  }, [dispatch, user?.id, navigate]);
  useEffect(() => {
    if (isSuccess && message) {
      setIsModalOpen(false);
      alert(message);
      if (activeTab === "transfer") {
        setFormTransferData({
          from_wallet_id: null,
          from_goal_id: null,
          to_wallet_id: null,
          to_goal_id: null,
          amount: "",
          transfer_date: transactionDate,
          note: "",
        });
      } else {
        setFormTransactionData({
          wallet_id: "",
          category_id: "",
          amount: "",
          transaction_date: transactionDate,
          note: "",
          transaction_type: activeTab === "income" ? "Income" : "Expense",
        });
      }
      if (user?.id) {
        dispatch(getTransactions(user.id));
      }
      dispatch(resetTransactionState());
    }

    if (isError && message) {
      alert(`Error: ${message}`);
      dispatch(resetTransactionState());
    }
  }, [
    isSuccess,
    isError,
    message,
    dispatch,
    user?.id,
    activeTab,
    transactionDate,
  ]);

  const handleFormChange = (e, formType) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "amount") {
      processedValue = value === "" ? "" : parseFloat(value) || "";
    } else if (name.includes("_id")) {
      processedValue = value === "" ? null : Number(value);
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
  };
  const handleSubmit = async () => {
    if (!user?.id) return;

    let payload = null;
    let actionToDispatch = null;
    let isValid = true;

    if (activeTab === "transfer") {
      if (
        (!formTransferData.from_wallet_id && !formTransferData.from_goal_id) ||
        (!formTransferData.to_wallet_id && !formTransferData.to_goal_id)
      ) {
        alert("Pilih sumber dan tujuan transfer.");
        isValid = false;
      } else if (
        (formTransferData.from_wallet_id && formTransferData.from_goal_id) ||
        (formTransferData.to_wallet_id && formTransferData.to_goal_id)
      ) {
        alert("Pilih hanya satu (Wallet atau Goal) sebagai sumber/tujuan.");
        isValid = false;
      } else if (
        formTransferData.from_wallet_id &&
        formTransferData.to_wallet_id &&
        formTransferData.from_wallet_id === formTransferData.to_wallet_id
      ) {
        alert("Tidak bisa transfer ke dompet yang sama.");
        isValid = false;
      } else if (
        !formTransferData.amount ||
        parseFloat(formTransferData.amount) <= 0
      ) {
        alert("Jumlah transfer harus diisi dan lebih dari 0.");
        isValid = false;
      }

      if (!isValid) return;

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
      if (
        !formTransactionData.wallet_id ||
        !formTransactionData.category_id ||
        !formTransactionData.amount ||
        parseFloat(formTransactionData.amount) <= 0
      ) {
        alert("Dompet, Kategori, dan Jumlah wajib diisi dan lebih dari 0.");
        isValid = false;
      }

      if (!isValid) return;

      payload = {
        wallet_id: Number(formTransactionData.wallet_id),
        category_id: Number(formTransactionData.category_id),
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
    await dispatch(actionToDispatch);
  };

  const safeTransactions = useMemo(
    () => (Array.isArray(transactions) ? transactions : []),
    [transactions]
  );
  const filteredTransactions = useMemo(
    () =>
      safeTransactions
        .map((tx, index) => ({ ...tx, no: index + 1 }))
        .filter((tx) => {
          const walletName = tx.wallet?.wallet_name?.toLowerCase() || "";
          const categoryName = tx.category?.category_name?.toLowerCase() || "";
          const date = tx.transaction_date?.toLowerCase() || "";
          const note = tx.note?.toLowerCase() || "";
          const search = searchTerm.toLowerCase();
          return (
            walletName.includes(search) ||
            categoryName.includes(search) ||
            date.includes(search) ||
            note.includes(search)
          );
        }),
    [safeTransactions, searchTerm]
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <ExpenseTrackerView
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsModalOpen={setIsModalOpen}
          transactionsToDisplay={filteredTransactions}
          isLoading={isLoading && transactions.length === 0}
        />
      </div>
      <AddTransactionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
      />
    </div>
  );
};

export default ExpenseTracker;
