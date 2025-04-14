import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Beranda from "./pages/Beranda/Beranda";
import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MyWallet from "./pages/My-Wallet/MyWallet";
import WalletDetail from "./pages/WalletDetails/WalletDetail";
import SmartBudgeting from "./pages/SmartBudgeting/SmartBudgeting";
import ExpenseTracker from "./pages/ExpenseTracker/ExpenseTracker";
import Kategori from "./pages/Kategori/Kategori";
import Settings from "./pages/Settings/Settings";
import GoalSaving from "./pages/GoalSaving/GoalSaving";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Verification from "./pages/Verification/Verification";
import ConfirmPassword from "./pages/ConfirmPassword/ConfirmPassword";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Beranda />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/beranda" replace />} />
          <Route path="beranda" element={<Dashboard />} />
          <Route path="transaksi" element={<ExpenseTracker />} />
          <Route path="anggaran" element={<SmartBudgeting />} />
          <Route path="goal" element={<GoalSaving />} />
          <Route path="kategori" element={<Kategori />} />
          <Route path="dompet" element={<MyWallet />} />
          <Route path="dompet/detail/:walletId" element={<WalletDetail />} />
          <Route path="pengaturan" element={<Settings />} />
        </Route>
        <Route path="*" element={<div>404 - Halaman Tidak Ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
