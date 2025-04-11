import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  checkCode,
  resetPasswordState,
} from "../../features/passwordReset/passwordResetSlice";
import VerificationView from "./VerificationView";

const Verification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputsRef = useRef([]);

  const { isLoading, isError, message } = useSelector(
    (state) => state.passwordReset
  );

  // Efek untuk load email & reset state
  useEffect(() => {
    const storedEmail = localStorage.getItem("reset_email");
    if (!storedEmail) {
      console.error("Email untuk verifikasi tidak ditemukan.");
      alert("Sesi tidak valid, silakan mulai dari lupa password lagi.");
      navigate("/forgot-password");
    } else {
      setEmail(storedEmail);
      dispatch(resetPasswordState());
      inputsRef.current[0]?.focus();
    }
    // Reset state saat unmount
    return () => {
        dispatch(resetPasswordState());
    }
  }, [navigate, dispatch]); // Hanya run sekali saat mount/unmount

  // Handler input OTP
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5 && value !== "") {
        inputsRef.current[index + 1]?.focus();
      }
    } else if (value === "" && index >= 0) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
      if (e.key === 'Backspace') {
          const newOtp = [...otp];
          if(newOtp[index]){
              newOtp[index] = '';
              setOtp(newOtp);
          } else if (index > 0) {
              inputsRef.current[index - 1]?.focus();
          }
      }
  }

  // Handler submit verifikasi kode
  const handleVerifyCode = async (event) => {
    event.preventDefault();
    const verificationCode = otp.join('');

    if (verificationCode.length !== 6) {
      alert('Kode verifikasi harus 6 digit.');
      return;
    }
    if (!email) {
      alert('Email tidak ditemukan. Silakan ulangi proses lupa password.');
      return;
    }

    dispatch(resetPasswordState()); // Reset sebelum dispatch
    console.log('Dispatching checkCode with:', { email, code: verificationCode });
    const resultAction = await dispatch(checkCode({ email, code: verificationCode }));
    console.log('Result action from checkCode:', resultAction); // Log hasil dispatch

    // Cek jika fulfilled
    if (checkCode.fulfilled.match(resultAction)) {
        console.log("checkCode fulfilled. Payload:", resultAction.payload);
        try {
            localStorage.setItem('verification_code', verificationCode);
            // Log konfirmasi SETELAH setItem
            console.log(`localStorage 'verification_code' SET to: ${localStorage.getItem('verification_code')}`);
            alert(resultAction.payload?.message || 'Kode valid!');
            navigate('/confirm-password'); // Navigasi HANYA jika fulfilled dan localStorage berhasil
        } catch (storageError) {
             console.error("Gagal menyimpan kode verifikasi ke localStorage:", storageError);
             alert("Terjadi kesalahan saat menyimpan sesi verifikasi. Coba lagi.");
             // Hapus item jika penyimpanan gagal
             localStorage.removeItem('verification_code');
        }
    }
    // Cek jika rejected
    else if (checkCode.rejected.match(resultAction)) {
        console.error('checkCode rejected:', resultAction.payload);
        // Hapus kode dari localStorage jika ada (karena tidak valid)
        localStorage.removeItem('verification_code');
        let errorMessage = resultAction.payload || 'Terjadi kesalahan verifikasi.';
        if (errorMessage.toLowerCase().includes('invalid code')) {
            errorMessage = 'Kode verifikasi salah.';
        }
        alert(`Gagal: ${errorMessage}`);
        setOtp(Array(6).fill("")); // Kosongkan input jika salah
        inputsRef.current[0]?.focus();
    }
  };

  return (
    <VerificationView
      email={email}
      otp={otp}
      handleChange={handleChange}
      handleKeyDown={handleKeyDown}
      inputsRef={inputsRef}
      handleVerifyCode={handleVerifyCode}
      isLoading={isLoading}
      error={isError ? message : null}
    />
  );
};

export default Verification;