import React, { useState } from "react";
import ConfirmPasswordView from "./ConfirmPasswordView";

const ConfirmPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <ConfirmPasswordView
      showPassword={showPassword}
      setShowPassword={setShowPassword}
    />
  );
};

export default ConfirmPassword;
