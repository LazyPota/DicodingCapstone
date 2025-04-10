import React, { useEffect, useState } from "react";
import LoginView from "./LoginView";
import api from "../../instance/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    return () => {
      const token = localStorage.getItem("token");
      if (token) {
        window.location.href = "/dashboard";
      }
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    api
      .post("capstone/user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/beranda";
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  

  return (
    <div>
      <LoginView
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    </div>
  );
};

export default Login;
