import React, { createContext, useContext, useState, useEffect } from 'react'
import AuthService from '../services/AuthService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Función para sincronizar el estado del usuario desde localStorage
  const syncUserFromStorage = () => {
    try {
      const userData = AuthService.getUser()
      console.log('Sincronizando usuario desde localStorage:', userData)
      setUser(userData)
      return userData
    } catch (error) {
      console.error('Error al sincronizar usuario:', error)
      return null
    }
  }

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = AuthService.getToken()
        const userData = AuthService.getUser()
        console.log('Inicializando auth:', { token: !!token, userData })

        if (token && userData) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error)
        AuthService.logout()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const result = await AuthService.login(username, password)
      if (result.success) {
        setUser(result.data.user)
      }
      return result
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  const updateUser = userData => {
    console.log('Actualizando usuario en contexto:', userData)
    setUser(userData)
    // También actualizar localStorage para mantener sincronización
    if (userData) {
      localStorage.setItem('auth_user', JSON.stringify(userData))
    }
  }

  const refreshUser = async () => {
    try {
      const result = await AuthService.getProfile()
      if (result.success && result.data) {
        setUser(result.data)
        return result.data
      }
    } catch (error) {
      console.error('Error al refrescar usuario:', error)
    }
    return null
  }

  const isAuthenticated = !!user && !!AuthService.getToken()

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    refreshUser,
    syncUserFromStorage,
    isAuthenticated
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
