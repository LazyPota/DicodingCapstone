import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Beranda from "./pages/Beranda/Beranda";
import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyWallet from "./pages/My-Wallet/MyWallet";
import WalletDetail from "./pages/WalletDetails/WalletDetail";
import SmartBudgeting from "./pages/SmartBudgeting/SmartBudgeting";
import ExpenseTracker from "./pages/ExpenseTracker/ExpenseTracker";
import Kategori from "./pages/Kategori/Kategori";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Beranda />} />
        <Route path="/beranda" element={<Dashboard />} />
        <Route path="/dompet" element={<MyWallet />} />
        <Route path="/dompet/detail" element={<WalletDetail />} />
        <Route path="/anggaran" element={<SmartBudgeting />} />
        <Route path="/transaksi" element={<ExpenseTracker />} />
        <Route path="/kategori" element={<Kategori />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
