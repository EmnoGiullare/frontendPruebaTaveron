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
}

export default AuthService
