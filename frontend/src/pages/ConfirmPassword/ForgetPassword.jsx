import React, { useState } from "react";
import ForgetPasswordView from "./ForgetPasswordView";

const ForgetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <ForgetPasswordView
      showPassword={showPassword}
      setShowPassword={setShowPassword}
    />
  );
};

export default ForgetPassword;
