import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import AuthService from '../../services/AuthService'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
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
      <div className='dashboard-header'>
        <h1>Dashboard</h1>
        <p>Bienvenido de vuelta, {user?.first_name || user?.username}!</p>
      </div>

      <div className='dashboard-content'>
        <div className='dashboard-cards'>
          <div className='dashboard-card'>
            <div className='card-icon'>👤</div>
            <div className='card-content'>
              <h3>Perfil</h3>
              <p>Gestiona tu información personal</p>
            </div>
          </div>

          <div className='dashboard-card'>
            <div className='card-icon'>📊</div>
            <div className='card-content'>
              <h3>Estadísticas</h3>
              <p>Visualiza tus datos</p>
            </div>
          </div>

          <div className='dashboard-card'>
            <div className='card-icon'>⚙️</div>
            <div className='card-content'>
              <h3>Configuración</h3>
              <p>Ajusta las preferencias</p>
            </div>
          </div>
        </div>

        <div className='user-info-section'>
          <h2>Información del Usuario</h2>
          <div className='user-details-grid'>
            <div className='user-detail-item'>
              <strong>Usuario:</strong> {user?.username}
            </div>
            <div className='user-detail-item'>
              <strong>Email:</strong> {user?.email}
            </div>
            <div className='user-detail-item'>
              <strong>Nombre:</strong> {user?.first_name} {user?.last_name}
            </div>
          </div>
        </div>

        <div className='api-test-section'>
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
