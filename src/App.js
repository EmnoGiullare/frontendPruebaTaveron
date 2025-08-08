import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Dashboard from './components/Dashboard/Dashboard'
import Profile from './components/Profile/Profile'
import './styles/App.css'

function App () {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/profile' element={<Profile />} />
                <Route
                  path='/'
                  element={<Navigate to='/dashboard' replace />}
                />
              </Routes>
            </Layout>
          </ProtectedRoute>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
