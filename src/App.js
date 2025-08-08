import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Dashboard from './components/Dashboard/Dashboard'
import './styles/App.css'

function App () {
  return (
    <AuthProvider>
      <div className='App'>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </div>
    </AuthProvider>
  )
}

export default App
