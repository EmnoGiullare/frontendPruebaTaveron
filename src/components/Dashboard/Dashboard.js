import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import AuthService from '../../services/AuthService'
import './Dashboard.css'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  const handleTestProtectedEndpoint = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const result = await AuthService.testProtectedEndpoint()
      setTestResult(result)
    } catch (error) {
      setTestResult({ success: false, error: error.message })
    }

    setTesting(false)
  }

  return (
    <div className='dashboard'>
      <header className='dashboard-header'>
        <h1>Dashboard</h1>
        <button onClick={logout} className='logout-button'>
          Cerrar Sesión
        </button>
      </header>

      <div className='dashboard-content'>
        <div className='user-info'>
          <h2>Información del Usuario</h2>
          <p>
            <strong>Usuario:</strong> {user?.username}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Nombre:</strong> {user?.first_name} {user?.last_name}
          </p>
        </div>

        <div className='api-test'>
          <h2>Probar API Protegida</h2>
          <button
            onClick={handleTestProtectedEndpoint}
            disabled={testing}
            className='test-api-button'
          >
            {testing ? 'Probando...' : 'Probar Endpoint Protegido'}
          </button>

          {testResult && (
            <div
              className={`test-result ${
                testResult.success ? 'success' : 'error'
              }`}
            >
              {testResult.success ? (
                <div>
                  <h3>✅ Prueba Exitosa</h3>
                  <p>
                    <strong>Mensaje:</strong> {testResult.data.mensaje}
                  </p>
                </div>
              ) : (
                <div>
                  <h3>❌ Error en la Prueba</h3>
                  <p>{testResult.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
