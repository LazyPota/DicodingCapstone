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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputsRef = useRef([]);

  const { isLoading, isError, message } = useSelector(
    (state) => state.passwordReset
  );

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

    return () => {
      dispatch(resetPasswordState());
    };
  }, [navigate, dispatch]);

  const clearErrors = () => {
    if (errors.otp) {
      setErrors({});
    }
    if (isError) {
      dispatch(resetPasswordState());
    }
  };

  const handleChange = (e, index) => {
    clearErrors();
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
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};
    const verificationCode = otp.join("");

    if (verificationCode.length !== 6) {
      formIsValid = false;
      newErrors.otp = "Kode verifikasi harus lengkap (6 digit).";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      console.log("Form verifikasi tidak valid (client-side)");
      return;
    }

    if (!email) {
      setErrors({ otp: "Email tidak ditemukan. Ulangi proses lupa password." });
      return;
    }

    dispatch(resetPasswordState());
    const verificationCode = otp.join("");
    console.log("Dispatching checkCode with:", {
      email,
      code: verificationCode,
    });
    const resultAction = await dispatch(
      checkCode({ email, code: verificationCode })
    );
    console.log("Result action from checkCode:", resultAction);

    if (checkCode.fulfilled.match(resultAction)) {
      console.log("checkCode fulfilled. Payload:", resultAction.payload);
      try {
        localStorage.setItem("verification_code", verificationCode);
        console.log(
          `localStorage 'verification_code' SET to: ${localStorage.getItem(
            "verification_code"
          )}`
        );
        const successMsg =
          resultAction.payload?.message || "Kode verifikasi valid!";
        navigate("/confirm-password", {
          state: { successMessage: successMsg },
        });
      } catch (storageError) {
        console.error(
          "Gagal menyimpan kode verifikasi ke localStorage:",
          storageError
        );
        setErrors({
          otp: "Terjadi kesalahan saat menyimpan sesi verifikasi. Coba lagi.",
        });
        localStorage.removeItem("verification_code");
      }
    } else if (checkCode.rejected.match(resultAction)) {
      console.error("checkCode rejected:", resultAction.payload);
      localStorage.removeItem("verification_code");
      setOtp(Array(6).fill(""));
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
      errors={errors}
    />
  );
};

export default Verification;
