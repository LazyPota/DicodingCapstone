import React, { useState } from "react";
import RegisterView from "./RegisterView";
import api from "../../instance/api";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    api
      .post("/capstone/user/register", {
        username: username,
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("Registrasi Berhasil:", response.data);
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error(
          "Error saat registrasi:",
          error.response || error.request || error.message
        );
        if (error.response) {
          alert(
            `Registrasi gagal: ${
              error.response.data.message || error.response.statusText
            }`
          );
        } else {
          alert("Gagal terhubung ke server.");
        }
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
        username={username}
        setUsername={setUsername}
        handleRegister={handleRegister}
      />
    </div>
  );
};

export default Register;
