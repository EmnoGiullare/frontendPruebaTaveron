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
      setUser(userData)
      return userData
    } catch (error) {
      console.error('Error al sincronizar usuario:', error)
      return null
    }
  }

  // Escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = e => {
      if (e.key === 'auth_user' || e.key === 'auth_token') {
        console.log('Cambio detectado en localStorage:', e.key, e.newValue)

        // Si se eliminó el token o el usuario, hacer logout
        if (e.newValue === null) {
          console.log('Token o usuario eliminado, haciendo logout...')
          setUser(null)
        } else if (e.key === 'auth_user' && e.newValue) {
          // Si se actualizó el usuario, sincronizar
          try {
            const userData = JSON.parse(e.newValue)
            setUser(userData)
          } catch (error) {
            console.error('Error al parsear usuario desde localStorage:', error)
          }
        }
      }
    }

    // Escuchar cambios en localStorage desde otras pestañas/ventanas
    window.addEventListener('storage', handleStorageChange)

    // También verificar periódicamente si hay cambios
    const checkAuthStatus = () => {
      const token = AuthService.getToken()
      const userData = AuthService.getUser()

      if (!token || !userData) {
        // Si no hay token o usuario, hacer logout
        if (user !== null) {
          console.log('No hay token o usuario, haciendo logout...')
          setUser(null)
        }
      }
    }

    const intervalId = setInterval(checkAuthStatus, 1000) // Verificar cada segundo

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(intervalId)
    }
  }, [user])

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = AuthService.getToken()
        const userData = AuthService.getUser()

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

  // ============ NUEVO MÉTODO PARA ELIMINAR CUENTA ============
  const deleteAccount = async () => {
    try {
      const result = await AuthService.deleteProfile()
      if (result.success) {
        console.log('Cuenta eliminada, limpiando estado...')
        setUser(null) // Forzar logout inmediato
      }
      return result
    } catch (error) {
      console.error('Error al eliminar cuenta:', error)
      return { success: false, error: error.message }
    }
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
    deleteAccount,
    isAuthenticated
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
