import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  resetPassword, // Hanya perlu thunk reset
  resetPasswordState, // dan action reset
} from "../../features/passwordReset/passwordResetSlice";
import ConfirmPasswordView from "./ConfirmPasswordView";

const ConfirmPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Hanya ambil state yg relevan untuk UI (loading, error)
  const { isLoading, isError, message } = useSelector(
    (state) => state.passwordReset
  );

  // State lokal untuk email/code
  const [emailFromStorage, setEmailFromStorage] = useState(null);
  const [codeFromStorage, setCodeFromStorage] = useState(null);

  // useEffect 1: Cek localStorage & Reset State Redux SAAT MOUNT
  useEffect(() => {
    const storedEmail = localStorage.getItem("reset_email");
    const storedCode = localStorage.getItem("verification_code");
    console.log("[ConfirmPassword Mount] Checking localStorage - Email:", storedEmail, "Code:", storedCode);
    if (!storedEmail || !storedCode) {
      console.error("Data sesi reset (email/kode) tidak ditemukan di localStorage saat halaman ConfirmPassword dimuat.");
      alert("Sesi reset password tidak valid atau sudah kedaluwarsa.");
      navigate("/forgot-password");
    } else {
      setEmailFromStorage(storedEmail);
      setCodeFromStorage(storedCode);
      dispatch(resetPasswordState()); // Reset state Redux di awal
    }
    // Reset juga saat unmount
    return () => {
      dispatch(resetPasswordState());
    }
  }, [navigate, dispatch]);

  // HAPUS useEffect kedua yang bereaksi ke isSuccess

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!password || !confirmPassword) { /* ... validasi ... */ return; }
    if (password !== confirmPassword) { /* ... validasi ... */ return; }

    if (!emailFromStorage || !codeFromStorage) { /* ... validasi ... */ return; }

    dispatch(resetPasswordState()); // Reset sebelum dispatch
    const resetData = {
      email: emailFromStorage,
      code: codeFromStorage,
      new_password: password,
      new_password_confirm: confirmPassword,
    };

    console.log("Dispatching resetPassword with data:", resetData);
    const resultAction = await dispatch(resetPassword(resetData));
    console.log("Result action from resetPassword:", resultAction);

    // === Handle Navigasi LANGSUNG di sini ===
    if (resetPassword.fulfilled.match(resultAction)) {
      // JIKA FULFILLED (Sukses)
      console.log("Reset password SUKSES (fulfilled), membersihkan storage dan navigasi ke login...");
      localStorage.removeItem("reset_email");
      localStorage.removeItem("verification_code");
      alert(resultAction.payload?.message || "Password berhasil diperbarui!"); // Gunakan payload dari action
      navigate("/login"); // Langsung navigasi
    } else if (resetPassword.rejected.match(resultAction)) {
      // JIKA REJECTED (Gagal)
      alert(
        `Gagal mereset password: ${
          resultAction.payload || "Terjadi kesalahan"
        }`
      );
    }
  };

  return (
    <ConfirmPasswordView
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      handleChangePassword={handleChangePassword}
      isLoading={isLoading} // Status loading dari Redux
      error={isError ? message : null} // Pesan error dari Redux
    />
  );
};

export default ConfirmPassword;