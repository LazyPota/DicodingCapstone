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
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const userData = { username, email, password };
    dispatch(registerUser(userData));
  };

  useEffect(() => {
    if (isError) {
      alert(`Registrasi Gagal: ${message}`);
    }

    if (isSuccess) {
      alert(message || "Registrasi berhasil! Silakan login.");
      navigate("/login");
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch]);

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
      />
    </div>
  );
};

export default Register;
