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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Beranda />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/mywallet" element={<MyWallet />}/>
        <Route path="/mywallet/detail" element={<WalletDetail />}/>
        <Route path="/smartbudgeting" element={<SmartBudgeting />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
