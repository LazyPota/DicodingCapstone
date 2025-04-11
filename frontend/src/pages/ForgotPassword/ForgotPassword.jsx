import React from 'react'
import ForgotPasswordView from './ForgotPasswordView'
import api from '../../instance/api';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');
  const handleSendEmail = (event) => {
    event.preventDefault()
    if (email) {
      sendEmail(email)
    } else {
      console.error('Email is required')
    }
  }
  const sendEmail = async (email) => {
    try {
      const response = await api.post('capstone/send-reset-code', { email })

      const data = await response
      if (data) {
        localStorage.setItem('reset_email', email)
        
        window.location.href = '/verification'
      }
      console.log(data.message)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <ForgotPasswordView handleSendEmail={handleSendEmail} email={email} setEmail={setEmail} />
  )
}

export default ForgotPassword