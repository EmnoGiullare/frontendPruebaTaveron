import { useAuth } from '../../context/AuthContext'
import Auth from '../Auth/Auth'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#7f8c8d'
        }}
      >
        ⏳ Cargando...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Auth />
  }

  return children
}

export default ProtectedRoute
