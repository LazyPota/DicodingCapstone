import React, { useState } from "react";
import LoginView from "./LoginView";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <LoginView
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    </div>
  );
};

export default Login;
