import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { sendResetCode, resetPasswordState } from '../../features/passwordReset/passwordResetSlice';
import ForgotPasswordView from './ForgotPasswordView';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, message } = useSelector((state) => state.passwordReset);

  useEffect(() => {
    dispatch(resetPasswordState()); // Reset state saat komponen masuk
  }, [dispatch]);

  const handleSendEmail = async (event) => {
    event.preventDefault();
    if (!email) {
      alert('Email wajib diisi.');
      return;
    }

    dispatch(resetPasswordState()); // Reset state sebelum dispatch baru
    console.log('Dispatching sendResetCode for:', email);
    const resultAction = await dispatch(sendResetCode(email));
    console.log('Result action from sendResetCode:', resultAction); // Log hasil dispatch

    // Periksa secara eksplisit jika action adalah fulfilled
    if (sendResetCode.fulfilled.match(resultAction)) {
      console.log('sendResetCode fulfilled. Payload:', resultAction.payload);
      try {
          localStorage.setItem('reset_email', email);
          // Log konfirmasi SETELAH setItem
          console.log(`localStorage 'reset_email' SET to: ${localStorage.getItem('reset_email')}`);
          alert(resultAction.payload?.message || 'Kode reset berhasil dikirim.');
          navigate('/verification'); // Navigasi HANYA jika fulfilled dan localStorage berhasil
      } catch (storageError) {
          console.error("Gagal menyimpan email ke localStorage:", storageError);
          alert("Terjadi kesalahan saat menyimpan sesi reset. Coba lagi.");
      }
    } else {
      // Handle rejected atau error lainnya
      const errorMessage = resultAction.payload || 'Terjadi kesalahan saat mengirim kode.';
      console.error('sendResetCode rejected or failed:', errorMessage);
      alert(`Gagal: ${errorMessage}`);
    }
  };

  return (
    <ForgotPasswordView
      handleSendEmail={handleSendEmail}
      email={email}
      setEmail={setEmail}
      isLoading={isLoading}
      error={isError ? message : null}
    />
  );
};

export default ForgotPassword;