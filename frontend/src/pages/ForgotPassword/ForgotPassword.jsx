import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  sendResetCode,
  resetPasswordState,
} from "../../features/passwordReset/passwordResetSlice";
import ForgotPasswordView from "./ForgotPasswordView";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const { isLoading, isError, message } = useSelector(
    (state) => state.passwordReset
  );

  const onChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    if (errors.email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: null,
      }));
    }
    if (isError) {
      dispatch(resetPasswordState());
    }
  };

  useEffect(() => {
    dispatch(resetPasswordState());
  }, [dispatch]);

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!email.trim()) {
      formIsValid = false;
      newErrors.email = "Email wajib diisi";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      formIsValid = false;
      newErrors.email = "Format email tidak valid";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSendEmail = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      console.log("Form lupa password tidak valid (client-side)");
      return;
    }

    dispatch(resetPasswordState());
    console.log("Dispatching sendResetCode for:", email);
    const resultAction = await dispatch(sendResetCode(email));
    console.log("Result action from sendResetCode:", resultAction);

    if (sendResetCode.fulfilled.match(resultAction)) {
      console.log("sendResetCode fulfilled. Payload:", resultAction.payload);
      try {
        localStorage.setItem("reset_email", email);
        console.log(
          `localStorage 'reset_email' SET to: ${localStorage.getItem(
            "reset_email"
          )}`
        );
        navigate("/verification");
      } catch (storageError) {
        console.error("Gagal menyimpan email ke localStorage:", storageError);
        alert("Terjadi kesalahan saat menyimpan sesi reset. Coba lagi.");
      }
    } else {
      const errorMessage =
        resultAction.payload || "Terjadi kesalahan saat mengirim kode.";
      console.error("sendResetCode rejected or failed:", errorMessage);
      alert(`Gagal: ${errorMessage}`);
    }
  };

  return (
    <ForgotPasswordView
      handleSendEmail={handleSendEmail}
      email={email}
      onChange={onChange}
      isLoading={isLoading}
      error={isError ? message : null}
      errors={errors}
    />
  );
};

export default ForgotPassword;
