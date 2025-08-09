const API_BASE_URL = 'http://127.0.0.1:8000/api'

class ContactosApiService {
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
      console.log(
        `📡 ${config.method} ${url}`,
        config.body ? JSON.parse(config.body) : ''
      )
      const response = await fetch(url, config)

      // Si la respuesta está vacía (como en DELETE), retornar éxito
      if (
        response.status === 204 ||
        response.headers.get('content-length') === '0'
      ) {
        return { success: true }
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            data.error ||
            `HTTP error! status: ${response.status}`
        )
      }

      console.log('✅ Respuesta exitosa:', data)
      return data
    } catch (error) {
      if (error.name === 'SyntaxError') {
        // Error de parsing JSON - probablemente respuesta vacía exitosa
        return { success: true }
      }
      console.error('❌ Error en request:', error)
      throw new Error(`Error de conexión: ${error.message}`)
    }
  }

  // ============ TIPOS PARA FORMULARIOS ============
  static async getTiposRelacion (token) {
    return this.request('/contactos/tipos/relacion/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async getTiposTelefono (token) {
    return this.request('/contactos/tipos/telefono/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async getTiposEmail (token) {
    return this.request('/contactos/tipos/email/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async getTiposDireccion (token) {
    return this.request('/contactos/tipos/direccion/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async getAllTipos (token) {
    try {
      const [tiposRelacion, tiposTelefono, tiposEmail, tiposDireccion] =
        await Promise.all([
          this.getTiposRelacion(token),
          this.getTiposTelefono(token),
          this.getTiposEmail(token),
          this.getTiposDireccion(token)
        ])

      return {
        relacion: tiposRelacion,
        telefono: tiposTelefono,
        email: tiposEmail,
        direccion: tiposDireccion
      }
    } catch (error) {
      throw new Error(`Error al obtener tipos: ${error.message}`)
    }
  }

  // ============ CRUD BÁSICO DE CONTACTOS ============
  static async getContactos (token, params = {}) {
    const queryParams = new URLSearchParams()

    // Parámetros de paginación
    if (params.page) queryParams.append('page', params.page)
    if (params.page_size) queryParams.append('page_size', params.page_size)

    // Parámetros de filtrado
    if (params.search) queryParams.append('search', params.search)
    if (params.tipo_relacion)
      queryParams.append('tipo_relacion', params.tipo_relacion)
    if (params.favorito !== undefined)
      queryParams.append('favorito', params.favorito)
    if (params.activo !== undefined) queryParams.append('activo', params.activo)
    if (params.empresa) queryParams.append('empresa__icontains', params.empresa)
    if (params.cargo) queryParams.append('cargo__icontains', params.cargo)

    // Parámetros de ordenamiento
    if (params.ordering) queryParams.append('ordering', params.ordering)

    const endpoint = `/contactos/${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`

    return this.request(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async getContacto (token, contactoId) {
    return this.request(`/contactos/${contactoId}/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async crearContacto (token, contactoData) {
    return this.request('/contactos/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: contactoData
    })
  }

  static async actualizarContacto (token, contactoId, contactoData) {
    return this.request(`/contactos/${contactoId}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: contactoData
    })
  }

  static async actualizarContactoParcial (token, contactoId, contactoData) {
    return this.request(`/contactos/${contactoId}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: contactoData
    })
  }

  static async eliminarContacto (token, contactoId) {
    return this.request(`/contactos/${contactoId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  // ============ ENDPOINTS ESPECIALIZADOS ============
  static async getContactosTodos (token, params = {}) {
    const queryParams = new URLSearchParams()

    if (params.search) queryParams.append('search', params.search)
    if (params.ordering) queryParams.append('ordering', params.ordering)

    const endpoint = `/contactos/todos/${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`

    return this.request(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async getContactosFavoritos (token, params = {}) {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page)
    if (params.page_size) queryParams.append('page_size', params.page_size)

    const endpoint = `/contactos/favoritos/${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`

    return this.request(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async getContactosPorTipo (token) {
    return this.request('/contactos/por-tipo/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async getEstadisticas (token) {
    return this.request('/contactos/estadisticas/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async buscarContactos (token, params = {}) {
    const queryParams = new URLSearchParams()

    // Parámetros de búsqueda
    if (params.q) queryParams.append('q', params.q)
    if (params.tipo) queryParams.append('tipo', params.tipo)
    if (params.favorito !== undefined)
      queryParams.append('favorito', params.favorito)
    if (params.empresa) queryParams.append('empresa', params.empresa)
    if (params.activo !== undefined) queryParams.append('activo', params.activo)

    // Paginación
    if (params.page) queryParams.append('page', params.page)
    if (params.page_size) queryParams.append('page_size', params.page_size)

    const endpoint = `/contactos/buscar/${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`

    return this.request(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static async toggleFavorito (token, contactoId) {
    return this.request(`/contactos/${contactoId}/toggle-favorito/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  // ============ MÉTODOS DE UTILIDAD ============
  static getAuthHeaders (token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  // ============ MÉTODOS HELPER PARA DATOS DE PRUEBA ============
  static getContactoDataTemplate () {
    return {
      nombre: '',
      apellido_pat: '',
      apellido_mat: '',
      tipo_relacion: null,
      empresa: '',
      cargo: '',
      fecha_nacimiento: '',
      notas: '',
      favorito: false,
      activo: true,
      telefonos: [
        {
          tipo_id: null,
          numero: '',
          principal: true
        }
      ],
      emails: [
        {
          tipo_id: null,
          email: '',
          principal: true
        }
      ],
      direcciones: [
        {
          tipo_id: null,
          calle: '',
          ciudad: '',
          estado_provincia: '',
          codigo_postal: '',
          pais: '',
          principal: true
        }
      ]
    }
  }

  static getContactoTestData (tipos) {
    const timestamp = Date.now()

    return {
      nombre: 'Test',
      apellido_pat: 'Usuario',
      apellido_mat: 'Prueba',
      tipo_relacion: tipos.relacion?.[0]?.id || 1,
      empresa: `Empresa Test ${timestamp}`,
      cargo: 'Desarrollador Test',
      fecha_nacimiento: '1990-01-01',
      notas: 'Contacto creado desde el frontend de React',
      favorito: true,
      activo: true,
      telefonos: [
        {
          tipo_id: tipos.telefono?.[0]?.id || 1,
          numero: `+5255${timestamp.toString().slice(-8)}`,
          principal: true
        }
      ],
      emails: [
        {
          tipo_id: tipos.email?.[0]?.id || 1,
          email: `test${timestamp}@ejemplo.com`,
          principal: true
        }
      ],
      direcciones: [
        {
          tipo_id: tipos.direccion?.[0]?.id || 1,
          calle: 'Calle Test 123, Col. Prueba',
          ciudad: 'Ciudad de México',
          estado_provincia: 'CDMX',
          codigo_postal: '01234',
          pais: 'México',
          principal: true
        }
      ]
    }
  }

  // ============ MÉTODOS PARA FILTROS Y BÚSQUEDAS AVANZADAS ============
  static buildSearchParams (filters) {
    const params = {}

    // Filtros básicos
    if (filters.search) params.q = filters.search
    if (filters.tipoRelacion) params.tipo = filters.tipoRelacion
    if (filters.favorito !== undefined) params.favorito = filters.favorito
    if (filters.activo !== undefined) params.activo = filters.activo
    if (filters.empresa) params.empresa = filters.empresa

    // Paginación
    if (filters.page) params.page = filters.page
    if (filters.pageSize) params.page_size = filters.pageSize

    return params
  }

  static async buscarContactosAvanzado (token, filters) {
    const params = this.buildSearchParams(filters)
    return this.buscarContactos(token, params)
  }

  // ============ MÉTODOS PARA ESTADÍSTICAS Y REPORTES ============
  static async getResumenCompleto (token) {
    try {
      const [contactos, estadisticas, favoritos, porTipo] = await Promise.all([
        this.getContactosTodos(token),
        this.getEstadisticas(token),
        this.getContactosFavoritos(token),
        this.getContactosPorTipo(token)
      ])

      return {
        contactos: contactos.results || contactos,
        total: contactos.count || contactos.length,
        estadisticas,
        favoritos: favoritos.results || favoritos,
        totalFavoritos: favoritos.count || favoritos.length,
        porTipo
      }
    } catch (error) {
      throw new Error(`Error al obtener resumen completo: ${error.message}`)
    }
  }
}

export default ContactosApiService
