import React, { useState } from 'react'
import Modal from '../Modal/Modal'
import AuthService from '../../services/AuthService'
import './PasswordChangeModal.css'

const PasswordChangeModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  })

  const handleInputChange = e => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Limpiar mensajes previos
    setError('')
    setSuccess('')

    // Validaciones
    if (!passwordData.old_password) {
      setError('Debes ingresar tu contraseña actual')
      return
    }

    if (!passwordData.new_password) {
      setError('Debes ingresar una nueva contraseña')
      return
    }

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (passwordData.new_password.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (passwordData.old_password === passwordData.new_password) {
      setError('La nueva contraseña debe ser diferente a la actual')
      return
    }

    setLoading(true)

    try {
      const result = await AuthService.changePassword(passwordData)

      if (result.success) {
        setSuccess('Contraseña cambiada correctamente')

        // Limpiar formulario
        setPasswordData({
          old_password: '',
          new_password: '',
          new_password_confirm: ''
        })

        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          onSuccess?.()
          onClose()
          setSuccess('')
        }, 2000)
      } else {
        setError(result.error || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      setError(error.message || 'Error al cambiar la contraseña')
    }

    setLoading(false)
  }

  const handleClose = () => {
    // Limpiar formulario al cerrar
    setPasswordData({
      old_password: '',
      new_password: '',
      new_password_confirm: ''
    })
    setError('')
    setSuccess('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='🔐 Cambiar Contraseña'
      size='medium'
    >
      <div className='password-change-modal'>
        {error && <div className='alert alert-error'>❌ {error}</div>}

        {success && <div className='alert alert-success'>✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='old_password'>Contraseña Actual: *</label>
            <input
              type='password'
              id='old_password'
              name='old_password'
              value={passwordData.old_password}
              onChange={handleInputChange}
              placeholder='Ingresa tu contraseña actual'
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div className='form-group'>
            <label htmlFor='new_password'>Nueva Contraseña: *</label>
            <input
              type='password'
              id='new_password'
              name='new_password'
              value={passwordData.new_password}
              onChange={handleInputChange}
              placeholder='Ingresa tu nueva contraseña (mín. 6 caracteres)'
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='new_password_confirm'>
              Confirmar Nueva Contraseña: *
            </label>
            <input
              type='password'
              id='new_password_confirm'
              name='new_password_confirm'
              value={passwordData.new_password_confirm}
              onChange={handleInputChange}
              placeholder='Confirma tu nueva contraseña'
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className='password-requirements'>
            <h5>Requisitos de la contraseña:</h5>
            <ul>
              <li
                className={
                  passwordData.new_password.length >= 6 ? 'valid' : 'invalid'
                }
              >
                Mínimo 6 caracteres
              </li>
              <li
                className={
                  passwordData.new_password ===
                    passwordData.new_password_confirm &&
                  passwordData.new_password
                    ? 'valid'
                    : 'invalid'
                }
              >
                Las contraseñas deben coincidir
              </li>
              <li
                className={
                  passwordData.old_password !== passwordData.new_password &&
                  passwordData.new_password
                    ? 'valid'
                    : 'invalid'
                }
              >
                Debe ser diferente a la contraseña actual
              </li>
            </ul>
          </div>

          <div className='modal-actions'>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={loading}
            >
              {loading ? '⏳ Cambiando...' : '🔐 Cambiar Contraseña'}
            </button>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={handleClose}
              disabled={loading}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default PasswordChangeModal
