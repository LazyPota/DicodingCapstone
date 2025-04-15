import React, { useState } from "react";
import RegisterView from "./RegisterView";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!name) {
      newErrors.name = "Nama wajib diisi";
    }

    if (!email) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Format Email tidak valid";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi";
    } else if (!password.length < 8) {
      newErrors.password = "Password minimal harus 8 karakter";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("Form registrasi valid, data siap dikirim:", {
        name,
        email,
        password,
      });
      alert("Registrasi Telah Berhasil");
    }
  };

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
        errors={errors}
        handleSubmit={handleSubmit}
        validateForm={validateForm}
      />
    </div>
  );
};

export default Register;
