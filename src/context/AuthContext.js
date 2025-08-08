import React, { createContext, useContext, useState, useEffect } from 'react'
import AuthService from '../services/AuthService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión guardada al cargar la app
    const savedUser = AuthService.getUser()
    if (savedUser && AuthService.isAuthenticated()) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    const result = await AuthService.login(username, password)

    if (result.success) {
      setUser(result.data.user)
    }

    setLoading(false)
    return result
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: AuthService.isAuthenticated()
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
