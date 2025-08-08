import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import AuthService from '../../services/AuthService'
import './Profile.css'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    username: ''
  })

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  })

  // Limpiar mensajes después de 5 segundos
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

  // Sincronizar formData cuando user cambie
  useEffect(() => {
    console.log('Usuario en Profile (useEffect):', user)
    if (user) {
      const newFormData = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        username: user.username || ''
      }
      console.log('Actualizando formData:', newFormData)
      setFormData(newFormData)
    }
  }, [user])

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = e => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError('')
    setSuccess('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError('')
    setSuccess('')
    // Restaurar datos originales
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        username: user.username || ''
      })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Guardando perfil con datos:', formData)
      const result = await AuthService.updateProfile(formData)
      console.log('Resultado de actualización:', result)

      if (result.success && result.data) {
        setSuccess('Perfil actualizado correctamente')
        setIsEditing(false)

        // Actualizar el contexto de usuario
        console.log('Actualizando contexto con:', result.data)
        updateUser(result.data)

        // Forzar re-render esperando un momento para que el contexto se actualice
        setTimeout(() => {
          console.log('Usuario después de timeout:', result.data)
          setFormData({
            first_name: result.data.first_name || '',
            last_name: result.data.last_name || '',
            email: result.data.email || '',
            phone: result.data.phone || '',
            address: result.data.address || '',
            username: result.data.username || ''
          })
        }, 100)
      } else {
        setError(result.error || 'Error al actualizar el perfil')
      }
    } catch (error) {
      console.error('Error al guardar:', error)
      setError(error.message || 'Error al actualizar el perfil')
    }

    setLoading(false)
  }

  const handlePasswordSubmit = async e => {
    e.preventDefault()

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (passwordData.new_password.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await AuthService.changePassword(passwordData)

      if (result.success) {
        setSuccess('Contraseña cambiada correctamente')
        setShowPasswordForm(false)
        setPasswordData({
          old_password: '',
          new_password: '',
          new_password_confirm: ''
        })
      } else {
        setError(result.error || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      setError(error.message || 'Error al cambiar la contraseña')
    }

    setLoading(false)
  }

  const refreshProfile = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Refrescando perfil...')
      const result = await AuthService.getProfile()
      console.log('Resultado de refresh:', result)

      if (result.success && result.data) {
        console.log('Actualizando contexto desde refresh con:', result.data)
        updateUser(result.data)
        setSuccess('Perfil actualizado desde el servidor')

        // Actualizar formData inmediatamente
        setTimeout(() => {
          setFormData({
            first_name: result.data.first_name || '',
            last_name: result.data.last_name || '',
            email: result.data.email || '',
            phone: result.data.phone || '',
            address: result.data.address || '',
            username: result.data.username || ''
          })
        }, 100)
      } else {
        setError(result.error || 'Error al obtener el perfil')
      }
    } catch (error) {
      console.error('Error al refrescar:', error)
      setError(error.message || 'Error al obtener el perfil')
    }

    setLoading(false)
  }

  // Mostrar loading si no hay usuario
  if (!user) {
    return (
      <div className='profile-container'>
        <div className='profile-header'>
          <h2>Cargando perfil...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className='profile-container'>
      <div className='profile-header'>
        <h2>Perfil de Usuario</h2>
        <div className='profile-actions'>
          <button
            className='refresh-button'
            onClick={refreshProfile}
            disabled={loading}
          >
            {loading ? '⏳ Actualizando...' : '🔄 Actualizar'}
          </button>
          {!isEditing && (
            <button className='edit-button' onClick={handleEdit}>
              ✏️ Editar
            </button>
          )}
        </div>
      </div>

      {error && <div className='alert alert-error'>❌ {error}</div>}

      {success && <div className='alert alert-success'>✅ {success}</div>}

      <div className='profile-content'>
        <div className='profile-avatar-section'>
          <div className='profile-avatar-large'>
            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || '?'}
          </div>
          <h3>
            {user?.first_name || 'Nombre'} {user?.last_name || 'Apellido'}
          </h3>
          <p className='profile-username'>@{user?.username}</p>

          <button
            className='change-password-btn'
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            🔐 Cambiar Contraseña
          </button>
        </div>

        <div className='profile-form'>
          <div className='form-section'>
            <h4>Información Personal</h4>

            <div className='form-row'>
              <div className='form-group'>
                <label>Nombre:</label>
                {isEditing ? (
                  <input
                    type='text'
                    name='first_name'
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder='Ingresa tu nombre'
                  />
                ) : (
                  <span>{user?.first_name || 'No especificado'}</span>
                )}
              </div>

              <div className='form-group'>
                <label>Apellido:</label>
                {isEditing ? (
                  <input
                    type='text'
                    name='last_name'
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder='Ingresa tu apellido'
                  />
                ) : (
                  <span>{user?.last_name || 'No especificado'}</span>
                )}
              </div>
            </div>

            <div className='form-group'>
              <label>Email:</label>
              {isEditing ? (
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Ingresa tu email'
                />
              ) : (
                <span>{user?.email || 'No especificado'}</span>
              )}
            </div>

            <div className='form-group'>
              <label>Teléfono:</label>
              {isEditing ? (
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder='Ingresa tu teléfono'
                />
              ) : (
                <span>{user?.phone || 'No especificado'}</span>
              )}
            </div>

            <div className='form-group'>
              <label>Dirección:</label>
              {isEditing ? (
                <input
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder='Ingresa tu dirección'
                />
              ) : (
                <span>{user?.address || 'No especificado'}</span>
              )}
            </div>

            <div className='form-group'>
              <label>Usuario:</label>
              <span>{user?.username}</span>
            </div>

            <div className='form-group'>
              <label>Rol:</label>
              <span>{user?.rol || 'No especificado'}</span>
            </div>
          </div>

          {isEditing && (
            <div className='form-actions'>
              <button
                className='save-button'
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? '⏳ Guardando...' : '💾 Guardar'}
              </button>
              <button
                className='cancel-button'
                onClick={handleCancel}
                disabled={loading}
              >
                ❌ Cancelar
              </button>
            </div>
          )}

          {/* Formulario de cambio de contraseña */}
          {showPasswordForm && (
            <div className='password-form-section'>
              <h4>Cambiar Contraseña</h4>
              <form onSubmit={handlePasswordSubmit}>
                <div className='form-group'>
                  <label>Contraseña Actual:</label>
                  <input
                    type='password'
                    name='old_password'
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Nueva Contraseña:</label>
                  <input
                    type='password'
                    name='new_password'
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className='form-group'>
                  <label>Confirmar Nueva Contraseña:</label>
                  <input
                    type='password'
                    name='new_password_confirm'
                    value={passwordData.new_password_confirm}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className='form-actions'>
                  <button
                    type='submit'
                    className='save-button'
                    disabled={loading}
                  >
                    {loading ? '⏳ Cambiando...' : '🔐 Cambiar Contraseña'}
                  </button>
                  <button
                    type='button'
                    className='cancel-button'
                    onClick={() => setShowPasswordForm(false)}
                    disabled={loading}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
