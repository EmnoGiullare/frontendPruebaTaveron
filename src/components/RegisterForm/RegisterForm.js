import React, { useState } from 'react'
import AuthService from '../../services/AuthService'
import './RegisterForm.css'

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('El nombre de usuario es requerido')
      return false
    }

    if (formData.username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres')
      return false
    }

    if (!formData.email.trim()) {
      setError('El email es requerido')
      return false
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido')
      return false
    }

    if (!formData.password) {
      setError('La contraseña es requerida')
      return false
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    if (formData.password !== formData.password_confirm) {
      setError('Las contraseñas no coinciden')
      return false
    }

    if (!formData.first_name.trim()) {
      setError('El nombre es requerido')
      return false
    }

    if (!formData.last_name.trim()) {
      setError('El apellido es requerido')
      return false
    }

    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log('Datos de registro:', formData)
      const result = await AuthService.register(formData)
      console.log('Resultado del registro:', result)

      if (result.success) {
        setSuccess('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.')

        // Limpiar formulario
        setFormData({
          username: '',
          email: '',
          password: '',
          password_confirm: '',
          first_name: '',
          last_name: '',
          phone: '',
          address: ''
        })

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          onSwitchToLogin()
        }, 3000)
      } else {
        setError(result.error || 'Error al crear la cuenta')
      }
    } catch (error) {
      console.error('Error en el registro:', error)
      setError(error.message || 'Error al crear la cuenta')
    }

    setLoading(false)
  }

  const fillTestData = () => {
    const timestamp = Date.now()
    setFormData({
      username: `usuario${timestamp}`,
      email: `usuario${timestamp}@ejemplo.com`,
      password: 'test123456',
      password_confirm: 'test123456',
      first_name: 'Usuario',
      last_name: 'Prueba',
      phone: '+1234567890',
      address: 'Calle Ejemplo 123'
    })
  }

  return (
    <div className='register-container'>
      <form onSubmit={handleSubmit} className='register-form'>
        <h2>Crear Cuenta</h2>
        <p className='register-subtitle'>
          Completa el formulario para registrarte
        </p>

        {error && <div className='alert alert-error'>❌ {error}</div>}
        {success && <div className='alert alert-success'>✅ {success}</div>}

        <div className='form-sections'>
          {/* Información de la cuenta */}
          <div className='form-section'>
            <h3>Información de la Cuenta</h3>

            <div className='form-group'>
              <label htmlFor='username'>Nombre de Usuario: *</label>
              <input
                type='text'
                id='username'
                name='username'
                value={formData.username}
                onChange={handleChange}
                placeholder='Ej: juan123'
                required
                disabled={loading}
                minLength={3}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='email'>Email: *</label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='ejemplo@correo.com'
                required
                disabled={loading}
              />
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='password'>Contraseña: *</label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Mínimo 6 caracteres'
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='password_confirm'>
                  Confirmar Contraseña: *
                </label>
                <input
                  type='password'
                  id='password_confirm'
                  name='password_confirm'
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder='Repite la contraseña'
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {/* Información personal */}
          <div className='form-section'>
            <h3>Información Personal</h3>

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='first_name'>Nombre: *</label>
                <input
                  type='text'
                  id='first_name'
                  name='first_name'
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder='Tu nombre'
                  required
                  disabled={loading}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='last_name'>Apellido: *</label>
                <input
                  type='text'
                  id='last_name'
                  name='last_name'
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder='Tu apellido'
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='phone'>Teléfono:</label>
              <input
                type='tel'
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='+1234567890'
                disabled={loading}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='address'>Dirección:</label>
              <input
                type='text'
                id='address'
                name='address'
                value={formData.address}
                onChange={handleChange}
                placeholder='Tu dirección completa'
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Indicadores de validación de contraseña */}
        {formData.password && (
          <div className='password-requirements'>
            <h4>Validación de Contraseña:</h4>
            <ul>
              <li
                className={formData.password.length >= 6 ? 'valid' : 'invalid'}
              >
                {formData.password.length >= 6 ? '✓' : '✗'} Mínimo 6 caracteres
              </li>
              <li
                className={
                  formData.password === formData.password_confirm &&
                  formData.password_confirm
                    ? 'valid'
                    : 'invalid'
                }
              >
                {formData.password === formData.password_confirm &&
                formData.password_confirm
                  ? '✓'
                  : '✗'}{' '}
                Las contraseñas coinciden
              </li>
            </ul>
          </div>
        )}

        <div className='form-actions'>
          <button type='submit' disabled={loading} className='register-button'>
            {loading ? '⏳ Creando cuenta...' : '🚀 Crear Cuenta'}
          </button>

          <button
            type='button'
            onClick={fillTestData}
            className='test-data-button'
            disabled={loading}
          >
            📝 Llenar con datos de prueba
          </button>
        </div>

        <div className='form-footer'>
          <p>
            ¿Ya tienes una cuenta?{' '}
            <button
              type='button'
              onClick={onSwitchToLogin}
              className='link-button'
              disabled={loading}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
