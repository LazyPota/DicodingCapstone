import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, reset } from "../../features/auth/authSlice";
import LoginView from "./LoginView";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { email, password } = formData;
  const [registrationSuccessMessage, setRegistrationSuccessMessage] =
    useState(null);
  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (location.state?.successMessage) {
      console.log(
        "Login page received success message:",
        location.state.successMessage
      );
      setRegistrationSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

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
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (registrationSuccessMessage) setRegistrationSuccessMessage(null);
      const userData = { email, password };
      dispatch(loginUser(userData));
    } else {
      console.log("Form login tidak valid (client-side)");
    }
  };

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/beranda");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      <LoginView
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        email={email}
        password={password}
        onChange={onChange}
        handleLogin={handleLogin}
        isLoading={isLoading}
        errors={errors}
        serverError={isError ? message : null}
        registrationSuccessMessage={registrationSuccessMessage}
      />
    </div>
  );
};

export default Login;
