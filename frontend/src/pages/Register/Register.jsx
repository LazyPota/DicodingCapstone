import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { registerUser, reset } from "../../features/auth/authSlice";
import RegisterView from "./RegisterView";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { username, email, password } = formData;
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = { username, email, password };
      dispatch(registerUser(userData));
    } else {
      console.log("Form registrasi tidak valid (client-side)");
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!username.trim()) {
      formIsValid = false;
      newErrors.username = "Nama Lengkap wajib diisi";
    }

    if (!email) {
      formIsValid = false;
      newErrors.email = "Email wajib diisi";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      formIsValid = false;
      newErrors.email = "Format email tidak valid";
    }

    if (!password) {
      formIsValid = false;
      newErrors.password = "Password wajib diisi";
    } else if (password.length < 8) {
      formIsValid = false;
      newErrors.password = "Password minimal 8 karakter";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  useEffect(() => {
    if (isSuccess) {
      const successMsg = message || "Registrasi berhasil! Silakan masuk.";
      console.log("Registrasi sukses, navigasi ke login dengan pesan:", successMsg);
      navigate("/login", {
          replace: true, 
          state: { successMessage: successMsg }
      });
    }
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, message, navigate, dispatch]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      <RegisterView
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        username={username}
        email={email}
        password={password}
        onChange={onChange}
        handleRegister={handleRegister}
        isLoading={isLoading}
        errors={errors}
        serverError={isError ? message : null}
      />
    </div>
  );
};

export default Register;
