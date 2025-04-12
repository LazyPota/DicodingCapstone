import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  resetPassword, 
  resetPasswordState, 
} from "../../features/passwordReset/passwordResetSlice";
import ConfirmPasswordView from "./ConfirmPasswordView";

const ConfirmPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, message } = useSelector(
    (state) => state.passwordReset
  );

  const [emailFromStorage, setEmailFromStorage] = useState(null);
  const [codeFromStorage, setCodeFromStorage] = useState(null);

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
      dispatch(resetPasswordState()); 
    }
    return () => {
      dispatch(resetPasswordState());
    }
  }, [navigate, dispatch]);

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!password || !confirmPassword) 
    if (password !== confirmPassword) 

    if (!emailFromStorage || !codeFromStorage) 

    dispatch(resetPasswordState()); 
    const resetData = {
      email: emailFromStorage,
      code: codeFromStorage,
      new_password: password,
      new_password_confirm: confirmPassword,
    };

    console.log("Dispatching resetPassword with data:", resetData);
    const resultAction = await dispatch(resetPassword(resetData));
    console.log("Result action from resetPassword:", resultAction);

    if (resetPassword.fulfilled.match(resultAction)) {
      console.log("Reset password SUKSES (fulfilled), membersihkan storage dan navigasi ke login...");
      localStorage.removeItem("reset_email");
      localStorage.removeItem("verification_code");
      alert(resultAction.payload?.message || "Password berhasil diperbarui!");
      navigate("/login"); 
    } else if (resetPassword.rejected.match(resultAction)) {
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
      isLoading={isLoading} 
      error={isError ? message : null} 
    />
  );
};

export default ConfirmPassword;