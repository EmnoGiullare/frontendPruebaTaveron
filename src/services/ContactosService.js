import ContactosApiService from './api/ContactosApiService'
import AuthService from './AuthService'

class ContactosService {
  // ============ MÉTODOS DE TIPOS ============
  static async getTipos () {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const tipos = await ContactosApiService.getAllTipos(token)
      return { success: true, data: tipos }
    } catch (error) {
      console.error('Error en getTipos:', error)
      return { success: false, error: error.message }
    }
  }

  static async getTiposRelacion () {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const tipos = await ContactosApiService.getTiposRelacion(token)
      return { success: true, data: tipos }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ============ CRUD DE CONTACTOS ============
  static async getContactos (params = {}) {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const contactos = await ContactosApiService.getContactos(token, params)
      return { success: true, data: contactos }
    } catch (error) {
      console.error('Error en getContactos:', error)
      return { success: false, error: error.message }
    }
  }

  static async getContacto (id) {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const contacto = await ContactosApiService.getContacto(token, id)
      return { success: true, data: contacto }
    } catch (error) {
      console.error('Error en getContacto:', error)
      return { success: false, error: error.message }
    }
  }

  static async crearContacto (contactoData) {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const contacto = await ContactosApiService.crearContacto(
        token,
        contactoData
      )
      return { success: true, data: contacto }
    } catch (error) {
      console.error('Error en crearContacto:', error)
      return { success: false, error: error.message }
    }
  }

  static async actualizarContacto (id, contactoData) {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const contacto = await ContactosApiService.actualizarContacto(
        token,
        id,
        contactoData
      )
      return { success: true, data: contacto }
    } catch (error) {
      console.error('Error en actualizarContacto:', error)
      return { success: false, error: error.message }
    }
  }

  static async eliminarContacto (id) {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      await ContactosApiService.eliminarContacto(token, id)
      return { success: true }
    } catch (error) {
      console.error('Error en eliminarContacto:', error)
      return { success: false, error: error.message }
    }
  }

  // ============ ENDPOINTS ESPECIALIZADOS ============
  static async getTodosLosContactos (params = {}) {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const contactos = await ContactosApiService.getContactosTodos(
        token,
        params
      )
      return { success: true, data: contactos }
    } catch (error) {
      console.error('Error en getTodosLosContactos:', error)
      return { success: false, error: error.message }
    }
  }

  static async getFavoritos (params = {}) {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const favoritos = await ContactosApiService.getContactosFavoritos(
        token,
        params
      )
      return { success: true, data: favoritos }
    } catch (error) {
      console.error('Error en getFavoritos:', error)
      return { success: false, error: error.message }
    }
  }

  static async getContactosPorTipo () {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const porTipo = await ContactosApiService.getContactosPorTipo(token)
      return { success: true, data: porTipo }
    } catch (error) {
      console.error('Error en getContactosPorTipo:', error)
      return { success: false, error: error.message }
    }
  }

  static async getEstadisticas () {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const estadisticas = await ContactosApiService.getEstadisticas(token)
      return { success: true, data: estadisticas }
    } catch (error) {
      console.error('Error en getEstadisticas:', error)
      return { success: false, error: error.message }
    }
  }

  static async buscarContactos (filtros = {}) {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const resultados = await ContactosApiService.buscarContactosAvanzado(
        token,
        filtros
      )
      return { success: true, data: resultados }
    } catch (error) {
      console.error('Error en buscarContactos:', error)
      return { success: false, error: error.message }
    }
  }

  static async toggleFavorito (id) {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const resultado = await ContactosApiService.toggleFavorito(token, id)
      return { success: true, data: resultado }
    } catch (error) {
      console.error('Error en toggleFavorito:', error)
      return { success: false, error: error.message }
    }
  }

  // ============ MÉTODOS DE UTILIDAD ============
  static async getResumenCompleto () {
    const token = AuthService.getToken()
    if (!token) {
      throw new Error('No hay token disponible')
    }

    try {
      const resumen = await ContactosApiService.getResumenCompleto(token)
      return { success: true, data: resumen }
    } catch (error) {
      console.error('Error en getResumenCompleto:', error)
      return { success: false, error: error.message }
    }
  }

  static getContactoTemplate () {
    return ContactosApiService.getContactoDataTemplate()
  }

  static async getContactoTestData () {
    try {
      const tiposResult = await this.getTipos()
      if (tiposResult.success) {
        return ContactosApiService.getContactoTestData(tiposResult.data)
      } else {
        // Fallback con IDs por defecto
        return ContactosApiService.getContactoTestData({
          relacion: [{ id: 1 }],
          telefono: [{ id: 1 }],
          email: [{ id: 1 }],
          direccion: [{ id: 1 }]
        })
      }
    } catch (error) {
      console.error('Error al obtener datos de prueba:', error)
      return ContactosApiService.getContactoDataTemplate()
    }
  }
}

export default ContactosService
