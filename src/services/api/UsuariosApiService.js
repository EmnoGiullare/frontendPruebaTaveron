const API_BASE_URL = 'https://Emno.pythonanywhere.com/api'

class ApiService {
  static async request (endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        )
      }

      return data
    } catch (error) {
      throw new Error(`Error de conexión: ${error.message}`)
    }
  }

  static async login (username, password) {
    return this.request('/usuarios/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
  }

  static async testProtectedEndpoint (token) {
    return this.request('/usuarios/protegida/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default ApiService
