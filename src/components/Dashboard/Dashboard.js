import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import ContactosService from '../../services/ContactosService'
import ContactCard from '../ContactCard/ContactCard'
import ContactModal from '../ContactModal/ContactModal'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()

  // Estados principales
  const [contactos, setContactos] = useState([])
  const [tipos, setTipos] = useState({})
  const [estadisticas, setEstadisticas] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Estados para modales
  const [showContactModal, setShowContactModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contactToDelete, setContactToDelete] = useState(null)

  // Estados para filtros y búsqueda
  const [filtros, setFiltros] = useState({
    search: '',
    tipo_relacion: '',
    favorito: '',
    activo: 'true',
    empresa: '',
    ordering: 'nombre'
  })

  // Estados para paginación
  const [paginacion, setPaginacion] = useState({
    page: 1,
    page_size: 12,
    total: 0,
    total_pages: 0
  })

  // Estados para vista
  const [vista, setVista] = useState('grid') // 'grid' o 'list'
  const [filtrosVisibles, setFiltrosVisibles] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales()
  }, [])

  // Cargar contactos cuando cambien los filtros o paginación
  const cargarContactos = React.useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const params = {
        page: paginacion.page,
        page_size: paginacion.page_size,
        ...filtros
      }

      // Limpiar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (
          params[key] === '' ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key]
        }
      })

      const result = await ContactosService.getContactos(params)

      if (result.success) {
        setContactos(result.data.results || result.data)

        // Actualizar información de paginación
        if (result.data.count !== undefined) {
          setPaginacion(prev => ({
            ...prev,
            total: result.data.count,
            total_pages: Math.ceil(result.data.count / prev.page_size)
          }))
        }
      } else {
        setError(result.error || 'Error al cargar contactos')
      }
    } catch (error) {
      console.error('Error al cargar contactos:', error)
      setError('Error al cargar contactos')
    }

    setLoading(false)
  }, [filtros, paginacion.page, paginacion.page_size])

  useEffect(() => {
    cargarContactos()
  }, [cargarContactos])

  const cargarDatosIniciales = async () => {
    setLoading(true)
    try {
      // Cargar tipos y estadísticas en paralelo
      const [tiposResult, estadisticasResult] = await Promise.all([
        ContactosService.getTipos(),
        ContactosService.getEstadisticas()
      ])

      if (tiposResult.success) {
        setTipos(tiposResult.data)
      }

      if (estadisticasResult.success) {
        setEstadisticas(estadisticasResult.data)
        console.log('Estadísticas recibidas:', estadisticasResult.data) // Para debug
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error)
      setError('Error al cargar la información inicial')
    }
    setLoading(false)
  }

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))

    // Resetear a página 1 cuando cambian los filtros
    setPaginacion(prev => ({ ...prev, page: 1 }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      search: '',
      tipo_relacion: '',
      favorito: '',
      activo: 'true',
      empresa: '',
      ordering: 'nombre'
    })
    setPaginacion(prev => ({ ...prev, page: 1 }))
  }

  const crearContacto = async contactoData => {
    try {
      const result = await ContactosService.crearContacto(contactoData)

      if (result.success) {
        setSuccess('Contacto creado exitosamente')
        setShowContactModal(false)
        cargarContactos() // Recargar lista

        // Actualizar estadísticas
        const estadisticasResult = await ContactosService.getEstadisticas()
        if (estadisticasResult.success) {
          setEstadisticas(estadisticasResult.data)
        }
      } else {
        setError(result.error || 'Error al crear contacto')
      }
    } catch (error) {
      console.error('Error al crear contacto:', error)
      setError('Error al crear contacto')
    }
  }

  const actualizarContacto = async contactoData => {
    try {
      const result = await ContactosService.actualizarContacto(
        editingContact.id,
        contactoData
      )

      if (result.success) {
        setSuccess('Contacto actualizado exitosamente')
        setShowContactModal(false)
        setEditingContact(null)
        cargarContactos() // Recargar lista
      } else {
        setError(result.error || 'Error al actualizar contacto')
      }
    } catch (error) {
      console.error('Error al actualizar contacto:', error)
      setError('Error al actualizar contacto')
    }
  }

  const eliminarContacto = async () => {
    if (!contactToDelete) return

    try {
      const result = await ContactosService.eliminarContacto(contactToDelete.id)

      if (result.success) {
        setSuccess('Contacto eliminado exitosamente')
        setShowDeleteModal(false)
        setContactToDelete(null)
        cargarContactos() // Recargar lista

        // Actualizar estadísticas
        const estadisticasResult = await ContactosService.getEstadisticas()
        if (estadisticasResult.success) {
          setEstadisticas(estadisticasResult.data)
        }
      } else {
        setError(result.error || 'Error al eliminar contacto')
      }
    } catch (error) {
      console.error('Error al eliminar contacto:', error)
      setError('Error al eliminar contacto')
    }
  }

  const toggleFavorito = async contactoId => {
    try {
      const result = await ContactosService.toggleFavorito(contactoId)

      if (result.success) {
        cargarContactos()

        // Actualizar estadísticas también
        const estadisticasResult = await ContactosService.getEstadisticas()
        if (estadisticasResult.success) {
          setEstadisticas(estadisticasResult.data)
        }
      } else {
        setError(result.error || 'Error al cambiar favorito')
      }
    } catch (error) {
      console.error('Error al toggle favorito:', error)
      setError('Error al cambiar favorito')
    }
  }

  const crearContactoPrueba = async () => {
    try {
      const contactoData = await ContactosService.getContactoTestData()
      await crearContacto(contactoData)
    } catch (error) {
      console.error('Error al crear contacto de prueba:', error)
      setError('Error al crear contacto de prueba')
    }
  }

  const handlePageChange = newPage => {
    setPaginacion(prev => ({ ...prev, page: newPage }))
  }

  const handleEditContact = contacto => {
    setEditingContact(contacto)
    setShowContactModal(true)
  }

  const handleDeleteContact = contacto => {
    setContactToDelete(contacto)
    setShowDeleteModal(true)
  }

  // Limpiar mensajes después de un tiempo
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 8000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div className='dashboard'>
      {/* Header */}
      <div className='dashboard-header'>
        <div className='header-content'>
          <div className='header-text'>
            <h1>📱 Agenda Electrónica</h1>
            <p>Bienvenido de vuelta, {user?.first_name || user?.username}!</p>
          </div>
          <div className='header-actions'>
            <button
              className='btn btn-primary'
              onClick={() => setShowContactModal(true)}
            >
              ➕ Nuevo Contacto
            </button>
            <button
              className='btn btn-secondary'
              onClick={crearContactoPrueba}
              disabled={loading}
            >
              🧪 Contacto de Prueba
            </button>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {error && <div className='alert alert-error'>❌ {error}</div>}
      {success && <div className='alert alert-success'>✅ {success}</div>}

      {/* Estadísticas Principales */}
      <div className='dashboard-stats'>
        <div className='stat-card'>
          <div className='stat-icon'>👥</div>
          <div className='stat-content'>
            <h3>{estadisticas.total_contactos || 0}</h3>
            <p>Total Contactos</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>⭐</div>
          <div className='stat-content'>
            <h3>{estadisticas.contactos_favoritos || 0}</h3>
            <p>Favoritos</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>✅</div>
          <div className='stat-content'>
            <h3>{estadisticas.contactos_activos || 0}</h3>
            <p>Activos</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>❌</div>
          <div className='stat-content'>
            <h3>{estadisticas.contactos_inactivos || 0}</h3>
            <p>Inactivos</p>
          </div>
        </div>
      </div>

      {/* Estadísticas Adicionales */}
      <div className='dashboard-stats secondary'>
        <div className='stat-card small'>
          <div className='stat-icon small'>📞</div>
          <div className='stat-content'>
            <h4>{estadisticas.con_telefono || 0}</h4>
            <p>Con Teléfono</p>
          </div>
        </div>
        <div className='stat-card small'>
          <div className='stat-icon small'>✉️</div>
          <div className='stat-content'>
            <h4>{estadisticas.con_email || 0}</h4>
            <p>Con Email</p>
          </div>
        </div>
        <div className='stat-card small'>
          <div className='stat-icon small'>🏠</div>
          <div className='stat-content'>
            <h4>{estadisticas.con_direccion || 0}</h4>
            <p>Con Dirección</p>
          </div>
        </div>

        {/* Estadísticas por Tipo de Relación */}
        {estadisticas.por_tipo_relacion && (
          <div className='stat-card tipos'>
            <div className='stat-header'>
              <div className='stat-icon small'>👨‍👩‍👧‍👦</div>
              <h4>Por Tipo de Relación</h4>
            </div>
            <div className='tipos-grid'>
              {Object.entries(estadisticas.por_tipo_relacion).map(
                ([tipo, data]) => (
                  <div key={tipo} className='tipo-item'>
                    <div
                      className='tipo-color'
                      style={{ backgroundColor: data.color }}
                    ></div>
                    <span className='tipo-nombre'>{tipo}</span>
                    <span className='tipo-count'>{data.count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className='dashboard-controls'>
        <div className='controls-left'>
          <button
            className={`btn btn-filter ${filtrosVisibles ? 'active' : ''}`}
            onClick={() => setFiltrosVisibles(!filtrosVisibles)}
          >
            🔍 Filtros
          </button>
          <button className='btn btn-clear' onClick={limpiarFiltros}>
            🗑️ Limpiar
          </button>
        </div>

        <div className='controls-center'>
          <input
            type='text'
            placeholder='Buscar contactos...'
            value={filtros.search}
            onChange={e => handleFiltroChange('search', e.target.value)}
            className='search-input'
          />
        </div>

        <div className='controls-right'>
          <button
            className={`btn btn-view ${vista === 'grid' ? 'active' : ''}`}
            onClick={() => setVista('grid')}
          >
            ⊞ Grid
          </button>
          <button
            className={`btn btn-view ${vista === 'list' ? 'active' : ''}`}
            onClick={() => setVista('list')}
          >
            ☰ Lista
          </button>
        </div>
      </div>

      {/* Panel de Filtros */}
      {filtrosVisibles && (
        <div className='filters-panel'>
          <div className='filters-grid'>
            <div className='filter-group'>
              <label>Tipo de Relación:</label>
              <select
                value={filtros.tipo_relacion}
                onChange={e =>
                  handleFiltroChange('tipo_relacion', e.target.value)
                }
              >
                <option value=''>Todos</option>
                {tipos.relacion?.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className='filter-group'>
              <label>Favoritos:</label>
              <select
                value={filtros.favorito}
                onChange={e => handleFiltroChange('favorito', e.target.value)}
              >
                <option value=''>Todos</option>
                <option value='true'>Solo Favoritos</option>
                <option value='false'>No Favoritos</option>
              </select>
            </div>

            <div className='filter-group'>
              <label>Estado:</label>
              <select
                value={filtros.activo}
                onChange={e => handleFiltroChange('activo', e.target.value)}
              >
                <option value=''>Todos</option>
                <option value='true'>Activos</option>
                <option value='false'>Inactivos</option>
              </select>
            </div>

            <div className='filter-group'>
              <label>Empresa:</label>
              <input
                type='text'
                placeholder='Filtrar por empresa...'
                value={filtros.empresa}
                onChange={e => handleFiltroChange('empresa', e.target.value)}
              />
            </div>

            <div className='filter-group'>
              <label>Ordenar por:</label>
              <select
                value={filtros.ordering}
                onChange={e => handleFiltroChange('ordering', e.target.value)}
              >
                <option value='nombre'>Nombre A-Z</option>
                <option value='-nombre'>Nombre Z-A</option>
                <option value='apellido_pat'>Apellido A-Z</option>
                <option value='-apellido_pat'>Apellido Z-A</option>
                <option value='empresa'>Empresa A-Z</option>
                <option value='-empresa'>Empresa Z-A</option>
                <option value='-fecha_modificacion'>Más Recientes</option>
                <option value='fecha_modificacion'>Más Antiguos</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Contactos */}
      <div className='contacts-section'>
        {loading ? (
          <div className='loading-container'>
            <div className='loading-spinner'></div>
            <p>Cargando contactos...</p>
          </div>
        ) : contactos.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-icon'>📭</div>
            <h3>No hay contactos</h3>
            <p>Crea tu primer contacto para comenzar a usar la agenda</p>
            <button
              className='btn btn-primary'
              onClick={() => setShowContactModal(true)}
            >
              ➕ Crear Primer Contacto
            </button>
          </div>
        ) : (
          <>
            <div className={`contacts-container ${vista}`}>
              {contactos.map(contacto => (
                <ContactCard
                  key={contacto.id}
                  contacto={contacto}
                  vista={vista}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  onToggleFavorito={toggleFavorito}
                />
              ))}
            </div>

            {/* Paginación */}
            {paginacion.total_pages > 1 && (
              <div className='pagination'>
                <button
                  className='btn btn-page'
                  onClick={() => handlePageChange(paginacion.page - 1)}
                  disabled={paginacion.page === 1}
                >
                  ← Anterior
                </button>

                <span className='pagination-info'>
                  Página {paginacion.page} de {paginacion.total_pages} (
                  {paginacion.total} contactos)
                </span>

                <button
                  className='btn btn-page'
                  onClick={() => handlePageChange(paginacion.page + 1)}
                  disabled={paginacion.page === paginacion.total_pages}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Contacto */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => {
          setShowContactModal(false)
          setEditingContact(null)
        }}
        onSave={editingContact ? actualizarContacto : crearContacto}
        contacto={editingContact}
        tipos={tipos}
        loading={loading}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setContactToDelete(null)
        }}
        onConfirm={eliminarContacto}
        title='🗑️ Eliminar Contacto'
        message={
          <div>
            <p>
              <strong>
                ¿Estás seguro de que deseas eliminar este contacto?
              </strong>
            </p>
            <p>
              Se eliminará: <strong>{contactToDelete?.nombre_completo}</strong>
            </p>
            <p>Esta acción no se puede deshacer.</p>
          </div>
        }
        confirmText='Eliminar'
        cancelText='Cancelar'
        type='danger'
        loading={loading}
      />
    </div>
  )
}

export default Dashboard
