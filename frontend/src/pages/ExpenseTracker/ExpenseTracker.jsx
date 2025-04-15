import React, { useState } from "react";
import ExpenseTrackerView from "./ExpenseTrackerView";

const ExpenseTracker = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState([
        { id: 1, wallet: "Mandiri", category: "Gaji Perbulan", date: "06 April, 2025", amount: 8000000, type: "income" },
        { id: 2, wallet: "Shopipay", category: "Bonus Hari Raya", date: "08 April, 2025", amount: 3500000, type: "income" },
        { id: 3, wallet: "Uang jajan", category: "Freelance Web Design", date: "10 April, 2025", amount: 10000000, type: "income" },
        { id: 4, wallet: "Shopipay", category: "Makan", date: "20 April, 2025", amount: 57000, type: "expense" },
        { id: 5, wallet: "Mandiri", category: "Transportasi", date: "28 April, 2025", amount: 12000, type: "expense" },
        { id: 6, wallet: "Uang jajan", category: "Salon", date: "31 April, 2025", amount: 120000, type: "expense" },
    ]);
  
    const filteredTransactions = transactions
      .map((tx, index) => ({ ...tx, no: index + 1 }))
      .filter((tx) =>
        tx.wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.date.includes(searchTerm)
    );

    const transactionsToDisplay = filteredTransactions; 



    return <ExpenseTrackerView transactions={transactions} searchTerm={searchTerm} setSearchTerm={setSearchTerm} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setTransactions={setTransactions} filteredTransactions={filteredTransactions} transactionsToDisplay={transactionsToDisplay} />;
    };

export default ExpenseTracker;