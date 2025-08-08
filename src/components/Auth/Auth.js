import React, { useState } from 'react'
import LoginForm from '../LoginForm/LoginForm'
import RegisterForm from '../RegisterForm/RegisterForm'
import './Auth.css'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)

  const switchToLogin = () => setIsLogin(true)
  const switchToRegister = () => setIsLogin(false)

  return (
    <div className='auth-container'>
      <div className='auth-content'>
        {isLogin ? (
          <LoginForm onSwitchToRegister={switchToRegister} />
        ) : (
          <RegisterForm onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  )
}

export default Auth
