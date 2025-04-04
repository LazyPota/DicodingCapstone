import React, { useState } from "react";
import ExpenseTrackerView from "./ExpenseTrackerView";

const ExpenseTracker = () => {
    const [transactions, setTransactions] = useState([
        { id: 1, wallet: "Mandiri", category: "Gaji Perbulan", date: "06 April, 2025", amount: 8000000, type: "income" },
        { id: 2, wallet: "Shopipay", category: "Bonus Hari Raya", date: "08 April, 2025", amount: 3500000, type: "income" },
        { id: 3, wallet: "Uang jajan", category: "Freelance Web Design", date: "10 April, 2025", amount: 10000000, type: "income" },
        { id: 4, wallet: "Shopipay", category: "Makan", date: "20 April, 2025", amount: 57000, type: "expense" },
        { id: 5, wallet: "Mandiri", category: "Transportasi", date: "28 April, 2025", amount: 12000, type: "expense" },
        { id: 6, wallet: "Uang jajan", category: "Salon", date: "31 April, 2025", amount: 120000, type: "expense" },
    ]);

    return <ExpenseTrackerView transactions={transactions} />;
    };

export default ExpenseTracker;