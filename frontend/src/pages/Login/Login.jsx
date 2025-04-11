import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, reset } from '../../features/auth/authSlice';
import LoginView from './LoginView';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(loginUser(userData)); 
  };

  useEffect(() => {
    if (isError) {
      alert(`Login Gagal: ${message}`); 
    }

    if (isSuccess || user) {
      navigate('/beranda'); 
    }

    return () => {
      dispatch(reset());
    }

  }, [user, token, isError, isSuccess, message, navigate, dispatch]); 

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
      />
    </div>
  );
};

export default Login;