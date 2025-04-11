import React, { useEffect, useRef } from 'react'
import VerificationView from './VerificationView'
import api from '../../instance/api';

const Verification = () => {
  const [verificationCode, setVerificationCode] = React.useState('      ');
  const inputsRef = useRef([]);

  useEffect(() => {
    const email = localStorage.getItem('reset_email')

    if (!email) {
      console.error('Email not found!')
      window.location.href = '/forgot-password'
    }

    inputsRef.current[0].focus();
  }, []);

  const handleChange = (e, idx) => {
    const value = e.target.value;
  
    if (/^[0-9]$/.test(value) || value === "") {
      const newCode = verificationCode.split('');
      newCode[idx] = value;
      setVerificationCode(newCode.join(''));
  
      if (value !== "" && idx < 5) {
        inputsRef.current[idx + 1].focus();
      } else if (value === "" && idx > 0) {
        inputsRef.current[idx - 1].focus();
      }
    }
  };
  

  const handleSendCode = (event) => {
    event.preventDefault()
    const formattedCode = verificationCode.split('').map(Number);
    const verificationCodeString = formattedCode.join('');
    if (verificationCodeString) {
      console.log('Verification code:', verificationCodeString)
      sendCode(verificationCodeString)
    } else {
      console.error('Verification code is required')
    }
  }

  const sendCode = async (verificationCodeString) => {
    const email = localStorage.getItem('reset_email')

    if (!email) {
      console.error('Email not found!')
      window.location.href = '/forgot-password'
    }

    try {
      const response = await api.post('capstone/check-code', { 
        email: email,
        code: verificationCodeString
      });
      console.log(response.data.message);

      localStorage.setItem('verification_code', verificationCodeString)
      window.location.href = '/confirm-password'

    } catch (error) {
      console.error('Verification error:', error.response?.data || error.message);
    }
  }
  
  return (
    <VerificationView 
      handleChange={handleChange}
      handleSendCode={handleSendCode}
      verificationCode={verificationCode}
      setVerificationCode={setVerificationCode}
      inputsRef={inputsRef}
    />
  )
}

export default Verification