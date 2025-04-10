import React, { useEffect, useState } from "react";
import RegisterView from "./RegisterView";
import api from "../../instance/api";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    return () => {
      const token = localStorage.getItem("token");
      if (token) {
        window.location.href = "/dashboard";
      }
    };
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    api
      .post("/register", {
        name: name,
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/beranda";
      });
  };

  // const validateForm = () => {
  //   const newErrors = {};
  //   const emailRegex =
  //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //   if (!name) {
  //     newErrors.name = "Nama wajib diisi";
  //   }

  //   if (!email) {
  //     newErrors.email = "Email wajib diisi";
  //   } else if (!emailRegex.test(email)) {
  //     newErrors.email = "Format Email tidak valid";
  //   }

  //   if (!password) {
  //     newErrors.password = "Password wajib diisi";
  //   } else if (!password.length < 8) {
  //     newErrors.password = "Password minimal harus 8 karakter";
  //   }

  //   return newErrors;
  // };

  return (
    <div>
      <RegisterView
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        password={password}
        setPassword={setPassword}
        email={email}
        setEmail={setEmail}
        name={name}
        setName={setName}
        handleRegister={handleRegister}
      />
    </div>
  );
};

export default Register;
