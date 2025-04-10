import React, { useState, useEffect } from "react";
import ExpenseTrackerView from "./ExpenseTrackerView";
import api from "../../instance/api";

const ExpenseTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("income");
  const [wallets, setWallets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const date = new Date();
  const transactionDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

  const [formTransactionData, setFormTransactionData] = useState({
    wallet_id: 0,
    category_id: 0,
    amount: 0,
    transaction_date: transactionDate,
    note: "",
    transaction_type: "Income",
  });

  const [formTransferData, setFormTransferData] = useState({
    form_wallet_id: 0,
    from_goal_id: 0,
    to_wallet_id: 0,
    to_goal_id: 0,
    amount: 0,
    transfer_date: transactionDate,
    note: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, walletRes, goalRes] = await Promise.all([
          api.get(`capstone/user/${user.id}/transactions/`),
          api.get(`capstone/user/${user.id}/wallets/`),
          api.get(`capstone/user/${user.id}/goal-savings/`),
          api.get(`capstone/user/${user.id}/categories/`),
        ]);

        setTransactions(txRes.data.result || []);
        setWallets(walletRes.data.result || []);
        setGoals(goalRes.data.result || []);
        setCategories(goalRes.data.result || []);

        console.log("Data transaksi berhasil diambil:", txRes.data.result);
      } catch (err) {
        console.error("Error saat ambil data:", err);
      }
    };

    fetchData();
  }, [user.id]);

  const handleFormChange = (field, value) => {
    if (activeTab === "transfer") {
      setFormTransferData((prev) => ({ ...prev, [field]: value }));
    } else {
      setFormTransactionData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      let payload = null;
      let endpoint = "";

      if (activeTab === "transfer") {
        payload = {
          ...formTransferData,
          amount: parseFloat(formTransferData.amount),
        };
        endpoint = `capstone/user/${user.id}/transfers/`;
      } else {
        payload = {
          ...formTransactionData,
          amount: parseFloat(formTransactionData.amount),
        };
        endpoint = `capstone/user/${user.id}/transactions/`;
      }

      const { data } = await api.post(endpoint, payload);
      setTransactions((prev) => [...prev, data.result]);
      setIsModalOpen(false);
      console.log("Berhasil tambah:", data);
    } catch (err) {
      console.error("Gagal tambah transaksi:", err);
    }
  };

  const filteredTransactions = transactions
    .map((tx, index) => ({ ...tx, no: index + 1 }))
    .filter((tx) =>
      [tx.wallet, tx.category, tx.transaction_date]
        .filter(Boolean)
        .some(
          (field) =>
            typeof field === "string" &&
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

  return (
    <ExpenseTrackerView
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      transactionsToDisplay={filteredTransactions}
      formData={activeTab === "transfer" ? formTransferData : formTransactionData}
      handleFormChange={handleFormChange}
      handleSubmit={handleSubmit}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      wallets={wallets}
      goals={goals}
      categories={categories}
    />
  );
};

export default ExpenseTracker;
