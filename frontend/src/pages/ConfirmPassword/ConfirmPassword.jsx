import React, { useEffect, useState } from "react";
// Tambahkan useLocation
import { useNavigate, useLocation } from "react-router-dom";
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
  const [errors, setErrors] = useState({}); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); 

  const [verificationSuccessMessage, setVerificationSuccessMessage] = useState(null);

  const { isLoading, isError, message } = useSelector(
    (state) => state.passwordReset
  );

  const [emailFromStorage, setEmailFromStorage] = useState(null);
  const [codeFromStorage, setCodeFromStorage] = useState(null);

  // Effect untuk setup, cek storage, dan baca pesan sukses dari Verifikasi
  useEffect(() => {
    if (location.state?.successMessage) {
      console.log("ConfirmPassword page received success message:", location.state.successMessage);
      setVerificationSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }

    const storedEmail = localStorage.getItem("reset_email");
    const storedCode = localStorage.getItem("verification_code");
    console.log("[ConfirmPassword Mount] Checking localStorage - Email:", storedEmail, "Code:", storedCode);
    if (!storedEmail || !storedCode) {
      console.error("Data sesi reset (email/kode) tidak ditemukan di localStorage.");
      navigate("/forgot-password", { state: { errorMessage: "Sesi reset password tidak valid atau kedaluwarsa." } });
    } else {
      setEmailFromStorage(storedEmail);
      setCodeFromStorage(storedCode);
      dispatch(resetPasswordState()); 
    }

    return () => {
      console.log("ConfirmPassword component unmounting, resetting state.");
      dispatch(resetPasswordState());
    }
  }, [navigate, dispatch, location]);

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!password) {
      formIsValid = false;
      newErrors.password = "Password baru wajib diisi.";
    } else if (password.length < 8) { 
      formIsValid = false;
      newErrors.password = "Password minimal 8 karakter.";
    }

    if (!confirmPassword) {
      formIsValid = false;
      newErrors.confirmPassword = "Konfirmasi password wajib diisi.";
    } else if (password && password !== confirmPassword) { 
      formIsValid = false;
      newErrors.confirmPassword = "Konfirmasi password tidak cocok.";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
     if (fieldName === 'password' && errors.confirmPassword === 'Konfirmasi password tidak cocok.') {
         setErrors((prev) => ({ ...prev, confirmPassword: null }));
     }
     if (fieldName === 'confirmPassword' && errors.confirmPassword === 'Konfirmasi password tidak cocok.') {
         setErrors((prev) => ({ ...prev, confirmPassword: null }));
     }
    if (isError) {
      dispatch(resetPasswordState());
    }
     if (verificationSuccessMessage) {
         setVerificationSuccessMessage(null);
     }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if(verificationSuccessMessage) setVerificationSuccessMessage(null);

    if (!validateForm()) {
      console.log("Form konfirmasi password tidak valid (client-side)");
      return;
    }

    if (!emailFromStorage || !codeFromStorage) {
        console.error("Mencoba submit tanpa email/kode dari storage.");
        setErrors({ general: "Sesi tidak valid. Ulangi proses lupa password." }); 
        return;
    }

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
      console.log("Reset password SUKSES (fulfilled), membersihkan storage...");
      localStorage.removeItem("reset_email");
      localStorage.removeItem("verification_code");
      const successMsg = resultAction.payload?.message || "Password berhasil diperbarui! Silakan login.";
      // Navigasi ke login DENGAN PESAN SUKSES
      navigate("/login", { replace: true, state: { successMessage: successMsg } });
    } else if (resetPassword.rejected.match(resultAction)) {
      // Error server akan otomatis ditampilkan oleh view
      console.error("Reset password GAGAL (rejected):", resultAction.payload);
      // Anda bisa menambahkan logika spesifik di sini jika perlu,
      // misal jika error adalah "Invalid code", arahkan kembali ke verifikasi
      if (resultAction.payload?.toLowerCase().includes('invalid verification code')) {
          alert("Kode verifikasi tidak valid atau sudah kedaluwarsa. Anda akan diarahkan kembali.");
          navigate('/verification'); // Atau /forgot-password
      }
      // Jika tidak, biarkan pesan error server tampil di halaman ini
    }
  };

  return (
    <ConfirmPasswordView
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      password={password}
      onChangePassword={handleInputChange(setPassword, 'password')} 
      confirmPassword={confirmPassword}
      onChangeConfirmPassword={handleInputChange(setConfirmPassword, 'confirmPassword')}
      handleChangePassword={handleChangePassword} 
      isLoading={isLoading}
      error={isError ? message : null} 
      errors={errors} 
      verificationSuccessMessage={verificationSuccessMessage} 
    />
  );
};

export default ConfirmPassword;