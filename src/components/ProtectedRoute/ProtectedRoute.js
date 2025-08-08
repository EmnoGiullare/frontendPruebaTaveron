import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
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

    const result = await login(credentials.username, credentials.password)

    if (!result.success) {
      setError(result.error)
    }
  }

  const fillTestCredentials = (username, password) => {
    setCredentials({ username, password })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Iniciar Sesión
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label>Usuario:</label>
          <input
            type='text'
            name='username'
            value={credentials.username}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Contraseña:</label>
          <input
            type='password'
            name='password'
            value={credentials.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}
            required
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>Credenciales de prueba:</p>
          <button
            type='button'
            onClick={() => fillTestCredentials('admin', 'admin123')}
            style={{
              margin: '0 0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Admin
          </button>
          <button
            type='button'
            onClick={() => fillTestCredentials('user1', 'user123')}
            style={{
              margin: '0 0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Usuario
          </button>
        </div>
      </form>
    </div>
  )
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Cargando...</div>
  }

  return isAuthenticated ? children : <LoginForm />
}

export default ProtectedRoute
