import ApiService from './api/UsuariosApiService.js'

class AuthService {
  static TOKEN_KEY = 'auth_token'
  static USER_KEY = 'auth_user'

  static async login (username, password) {
    try {
      const response = await ApiService.login(username, password)

      if (response.access) {
        localStorage.setItem(this.TOKEN_KEY, response.access)
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user))
        return { success: true, data: response }
      }

      throw new Error('No se recibió token de acceso')
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ============ NUEVO MÉTODO DE REGISTRO ============
  static async register (userData) {
    try {
      console.log('Registrando usuario:', userData)
      const response = await ApiService.register(userData)
      console.log('Respuesta de registro:', response)

      // El servidor devuelve { message: "...", user: {...} }
      if (response.user || response.id) {
        return { success: true, data: response }
      }

      return { success: true, data: response }
    } catch (error) {
      console.error('Error en register:', error)
      return { success: false, error: error.message }
    }
  }

  static logout () {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  static getToken () {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static getUser () {
    const user = localStorage.getItem(this.USER_KEY)
    return user ? JSON.parse(user) : null
  }

  static isAuthenticated () {
    return !!this.getToken()
  }

  static async testProtectedEndpoint () {
    const token = this.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const response = await ApiService.testProtectedEndpoint(token)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ============ MÉTODOS PARA PERFIL ============
  static async getProfile () {
    const token = this.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const response = await ApiService.getProfile(token)
      const userData = response.user || response

      // Actualizar localStorage con los datos más recientes
      if (userData && (userData.id || userData.username)) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData))
      }

      return { success: true, data: userData }
    } catch (error) {
      console.error('Error en getProfile:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateProfile (profileData) {
    const token = this.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const response = await ApiService.updateProfile(token, profileData)
      const userData = response.user || response

      // Actualizar la información del usuario en localStorage
      if (userData && (userData.id || userData.username)) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData))
      }

      return { success: true, data: userData }
    } catch (error) {
      console.error('Error en updateProfile:', error)
      return { success: false, error: error.message }
    }
  }

  static async changePassword (passwordData) {
    const token = this.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const response = await ApiService.changePassword(token, passwordData)
      return { success: true, data: response }
    } catch (error) {
      console.error('Error en changePassword:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteProfile () {
    const token = this.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const response = await ApiService.deleteProfile(token)
      // Limpiar localStorage después de eliminar la cuenta
      this.logout()
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default AuthService
