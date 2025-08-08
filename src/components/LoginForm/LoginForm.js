import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './LoginForm.css'

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const { login, loading } = useAuth()

  const handleChange = e => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (!credentials.username || !credentials.password) {
      setError('Por favor, completa todos los campos')
      return
    }

    const result = await login(credentials.username, credentials.password)

    if (!result.success) {
      setError(result.error)
    }
  }

  const fillTestCredentials = (username, password) => {
    setCredentials({ username, password })
  }

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit} className='login-form'>
        <h2>Iniciar Sesión</h2>

        {error && <div className='error-message'>{error}</div>}

        <div className='form-group'>
          <label htmlFor='username'>Usuario:</label>
          <input
            type='text'
            id='username'
            name='username'
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Contraseña:</label>
          <input
            type='password'
            id='password'
            name='password'
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type='submit' disabled={loading} className='login-button'>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        <div className='test-buttons'>
          <p>Credenciales de prueba:</p>
          <button
            type='button'
            onClick={() => fillTestCredentials('admin', 'admin123')}
            className='test-button'
          >
            Admin
          </button>
          <button
            type='button'
            onClick={() => fillTestCredentials('user1', 'user123')}
            className='test-button'
          >
            Usuario
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
