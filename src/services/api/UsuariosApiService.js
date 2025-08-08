const API_BASE_URL = 'https://Emno.pythonanywhere.com/api'

class ApiService {
  static async request (endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    // Configuración base
    const config = {
      method: 'GET',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }

    // Si hay un body, asegurarnos de que esté como string JSON
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      console.log('Enviando petición:', {
        url,
        method: config.method,
        headers: config.headers,
        body: config.body
      })

      const response = await fetch(url, config)

      console.log('Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })

      // Si la respuesta está vacía (como en DELETE), retornar éxito
      if (
        response.status === 204 ||
        response.headers.get('content-length') === '0'
      ) {
        return { success: true }
      }

      const data = await response.json()
      console.log('Datos de respuesta:', data)

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            data.error ||
            `HTTP error! status: ${response.status}`
        )
      }

      return data
    } catch (error) {
      if (error.name === 'SyntaxError') {
        // Error de parsing JSON - probablemente respuesta vacía exitosa
        return { success: true }
      }
      console.error('Error en petición:', error)
      throw new Error(`Error de conexión: ${error.message}`)
    }
  }

  // ============ AUTENTICACIÓN ============
  static async login (username, password) {
    return this.request('/usuarios/token/', {
      method: 'POST',
      body: { username, password }
    })
  }

  static async register (userData) {
    return this.request('/usuarios/register/', {
      method: 'POST',
      body: userData
    })
  }

  // ============ ENDPOINTS PROTEGIDOS ============
  static async testProtectedEndpoint (token) {
    return this.request('/usuarios/protegida/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  // ============ PERFIL DE USUARIO ============
  static async getProfile (token) {
    return this.request('/usuarios/profile/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async updateProfile (token, profileData) {
    return this.request('/usuarios/profile/', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: profileData
    })
  }

  static async deleteProfile (token) {
    return this.request('/usuarios/profile/', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  // ============ GESTIÓN DE USUARIO ESPECÍFICO ============
  static async getUserDetail (token, userId) {
    return this.request(`/usuarios/users/${userId}/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async updateUserDetail (token, userId, userData) {
    return this.request(`/usuarios/users/${userId}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: userData
    })
  }

  // ============ CAMBIO DE CONTRASEÑA ============
  static async changePassword (token, passwordData) {
    return this.request('/usuarios/change-password/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: passwordData
    })
  }

  // ============ MÉTODOS DE UTILIDAD ============
  static getAuthHeaders (token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
}

export default ApiService
