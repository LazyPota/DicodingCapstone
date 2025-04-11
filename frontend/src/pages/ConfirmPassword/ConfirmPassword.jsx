import React, { useEffect, useState } from "react";
import ConfirmPasswordView from "./ConfirmPasswordView";
import api from "../../instance/api";

const ConfirmPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    console.log("setConfirmPassword", typeof setConfirmPassword);

    const email = localStorage.getItem("reset_email");
    const verificationCode = localStorage.getItem("verification_code");
    if (!email || !verificationCode) {
      console.error("Email or verification code not found!");
      window.location.href = "/forgot-password";
    }
  },[])
  const handleChangePassword = (event) => {
    event.preventDefault();
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        changePassword(password);
      } else {
        console.error("Passwords do not match");
      }
    } else {
      console.error("Both fields are required");
    }
  }
  const changePassword = async (password) => {
    try {
      const response = await api.post('capstone/reset-password', { new_password: password, new_password_confirm: confirmPassword })
      const data = await response
      if (data) {
        console.log(data.message)
        localStorage.removeItem('reset_email')
        localStorage.removeItem('verification_code')
        window.location.href = '/login'
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <ConfirmPasswordView
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      handleChangePassword={handleChangePassword}
    />
  );
};

export default ConfirmPassword;
