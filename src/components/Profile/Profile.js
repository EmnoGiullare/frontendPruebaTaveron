import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    username: user?.username || ''
  })

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      username: user?.username || ''
    })
  }

  const handleSave = () => {
    // Aquí implementarías la lógica para guardar los cambios
    console.log('Guardando cambios:', formData)
    setIsEditing(false)
    // TODO: Llamar a la API para actualizar el perfil
  }

  return (
    <div className='profile-container'>
      <div className='profile-header'>
        <h2>Perfil de Usuario</h2>
        {!isEditing && (
          <button className='edit-button' onClick={handleEdit}>
            ✏️ Editar
          </button>
        )}
      </div>

      <div className='profile-content'>
        <div className='profile-avatar-section'>
          <div className='profile-avatar-large'>
            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || '?'}
          </div>
          <h3>
            {user?.first_name} {user?.last_name}
          </h3>
          <p className='profile-username'>@{user?.username}</p>
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
                />
              ) : (
                <span>{user?.email || 'No especificado'}</span>
              )}
            </div>

            <div className='form-group'>
              <label>Usuario:</label>
              <span>{user?.username}</span>
            </div>
          </div>

          {isEditing && (
            <div className='form-actions'>
              <button className='save-button' onClick={handleSave}>
                💾 Guardar
              </button>
              <button className='cancel-button' onClick={handleCancel}>
                ❌ Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
