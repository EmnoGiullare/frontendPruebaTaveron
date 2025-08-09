import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'
import './ContactModal.css'

const ContactModal = ({
  isOpen,
  onClose,
  onSave,
  contacto = null,
  tipos = {},
  loading = false
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_pat: '',
    apellido_mat: '',
    tipo_relacion: '',
    empresa: '',
    cargo: '',
    fecha_nacimiento: '',
    notas: '',
    favorito: false,
    activo: true,
    telefonos: [
      {
        tipo_id: '',
        numero: '',
        principal: true
      }
    ],
    emails: [
      {
        tipo_id: '',
        email: '',
        principal: true
      }
    ],
    direcciones: [
      {
        tipo_id: '',
        calle: '',
        ciudad: '',
        estado_provincia: '',
        codigo_postal: '',
        pais: 'México',
        principal: true
      }
    ]
  })

  const [errors, setErrors] = useState({})
  const [currentTab, setCurrentTab] = useState('basico')

  // Resetear formulario cuando cambie el contacto o se abra/cierre el modal
  useEffect(() => {
    if (isOpen) {
      if (contacto) {
        // Modo edición - cargar datos del contacto
        setFormData({
          nombre: contacto.nombre || '',
          apellido_pat: contacto.apellido_pat || '',
          apellido_mat: contacto.apellido_mat || '',
          // Manejar tipo_relacion como objeto o ID
          tipo_relacion:
            contacto.tipo_relacion?.id || contacto.tipo_relacion || '',
          empresa: contacto.empresa || '',
          cargo: contacto.cargo || '',
          fecha_nacimiento: contacto.fecha_nacimiento || '',
          notas: contacto.notas || '',
          favorito: contacto.favorito || false,
          activo: contacto.activo !== undefined ? contacto.activo : true,
          // Mapear teléfonos desde la nueva estructura
          telefonos:
            contacto.telefonos?.length > 0
              ? contacto.telefonos.map(tel => ({
                  id: tel.id,
                  tipo_id: tel.tipo?.id || tel.tipo_id || '',
                  numero: tel.numero || '',
                  principal: tel.principal || false
                }))
              : [{ tipo_id: '', numero: '', principal: true }],
          // Mapear emails desde la nueva estructura
          emails:
            contacto.emails?.length > 0
              ? contacto.emails.map(email => ({
                  id: email.id,
                  tipo_id: email.tipo?.id || email.tipo_id || '',
                  email: email.email || '',
                  principal: email.principal || false
                }))
              : [{ tipo_id: '', email: '', principal: true }],
          // Mapear direcciones desde la nueva estructura
          direcciones:
            contacto.direcciones?.length > 0
              ? contacto.direcciones.map(dir => ({
                  id: dir.id,
                  tipo_id: dir.tipo?.id || dir.tipo_id || '',
                  calle: dir.calle || '',
                  ciudad: dir.ciudad || '',
                  estado_provincia: dir.estado_provincia || '',
                  codigo_postal: dir.codigo_postal || '',
                  pais: dir.pais || 'México',
                  principal: dir.principal || false
                }))
              : [
                  {
                    tipo_id: '',
                    calle: '',
                    ciudad: '',
                    estado_provincia: '',
                    codigo_postal: '',
                    pais: 'México',
                    principal: true
                  }
                ]
        })
      } else {
        // Modo creación - formulario vacío
        resetForm()
      }
      setErrors({})
      setCurrentTab('basico')
    }
  }, [isOpen, contacto])

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido_pat: '',
      apellido_mat: '',
      tipo_relacion: '',
      empresa: '',
      cargo: '',
      fecha_nacimiento: '',
      notas: '',
      favorito: false,
      activo: true,
      telefonos: [{ tipo_id: '', numero: '', principal: true }],
      emails: [{ tipo_id: '', email: '', principal: true }],
      direcciones: [
        {
          tipo_id: '',
          calle: '',
          ciudad: '',
          estado_provincia: '',
          codigo_postal: '',
          pais: 'México',
          principal: true
        }
      ]
    })
  }

  // Manejar cambios en campos básicos
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  // Manejar cambios en arrays (teléfonos, emails, direcciones)
  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  // Agregar elemento a array
  const addArrayItem = arrayName => {
    const newItem = {
      telefonos: { tipo_id: '', numero: '', principal: false },
      emails: { tipo_id: '', email: '', principal: false },
      direcciones: {
        tipo_id: '',
        calle: '',
        ciudad: '',
        estado_provincia: '',
        codigo_postal: '',
        pais: 'México',
        principal: false
      }
    }

    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem[arrayName]]
    }))
  }

  // Eliminar elemento de array
  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }))
  }

  // Marcar como principal
  const setPrincipal = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => ({
        ...item,
        principal: i === index
      }))
    }))
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    // Campos requeridos
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.apellido_pat.trim()) {
      newErrors.apellido_pat = 'El apellido paterno es requerido'
    }

    // Validar al menos un teléfono o email
    const tienetelefono = formData.telefonos.some(tel => tel.numero.trim())
    const tieneEmail = formData.emails.some(email => email.email.trim())

    if (!tienetelefono && !tieneEmail) {
      newErrors.contacto = 'Debe proporcionar al menos un teléfono o email'
    }

    // Validar emails
    formData.emails.forEach((email, index) => {
      if (email.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.email)) {
          newErrors[`email_${index}`] = 'Email inválido'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Preparar datos para envío
    const cleanedData = {
      ...formData,
      // Limpiar y preparar teléfonos
      telefonos: formData.telefonos
        .filter(tel => tel.numero.trim())
        .map(tel => ({
          ...(tel.id && { id: tel.id }),
          tipo_id: tel.tipo_id || null,
          numero: tel.numero.trim(),
          principal: tel.principal
        })),
      // Limpiar y preparar emails
      emails: formData.emails
        .filter(email => email.email.trim())
        .map(email => ({
          ...(email.id && { id: email.id }),
          tipo_id: email.tipo_id || null,
          email: email.email.trim(),
          principal: email.principal
        })),
      // Limpiar y preparar direcciones
      direcciones: formData.direcciones
        .filter(dir => dir.calle.trim())
        .map(dir => ({
          ...(dir.id && { id: dir.id }),
          tipo_id: dir.tipo_id || null,
          calle: dir.calle.trim(),
          ciudad: dir.ciudad.trim() || '',
          estado_provincia: dir.estado_provincia.trim() || '',
          codigo_postal: dir.codigo_postal.trim() || '',
          pais: dir.pais.trim() || 'México',
          principal: dir.principal
        }))
    }

    console.log('Datos a enviar:', cleanedData)
    onSave(cleanedData)
  }

  // Manejar cierre del modal
  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  const isEditing = !!contacto

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? '✏️ Editar Contacto' : '➕ Nuevo Contacto'}
      size='large'
    >
      <form onSubmit={handleSubmit} className='contact-form'>
        {/* Tabs de navegación */}
        <div className='form-tabs'>
          <button
            type='button'
            className={`tab-button ${currentTab === 'basico' ? 'active' : ''}`}
            onClick={() => setCurrentTab('basico')}
          >
            👤 Información Básica
          </button>
          <button
            type='button'
            className={`tab-button ${
              currentTab === 'telefonos' ? 'active' : ''
            }`}
            onClick={() => setCurrentTab('telefonos')}
          >
            📞 Teléfonos
          </button>
          <button
            type='button'
            className={`tab-button ${currentTab === 'emails' ? 'active' : ''}`}
            onClick={() => setCurrentTab('emails')}
          >
            ✉️ Emails
          </button>
          <button
            type='button'
            className={`tab-button ${
              currentTab === 'direcciones' ? 'active' : ''
            }`}
            onClick={() => setCurrentTab('direcciones')}
          >
            🏠 Direcciones
          </button>
        </div>

        {/* Error general */}
        {errors.contacto && (
          <div className='form-error'>❌ {errors.contacto}</div>
        )}

        {/* Tab: Información Básica */}
        {currentTab === 'basico' && (
          <div className='tab-content'>
            <div className='form-row'>
              <div className='form-group'>
                <label>Nombre *</label>
                <input
                  type='text'
                  value={formData.nombre}
                  onChange={e => handleInputChange('nombre', e.target.value)}
                  className={errors.nombre ? 'error' : ''}
                  placeholder='Ingresa el nombre'
                />
                {errors.nombre && (
                  <span className='error-text'>{errors.nombre}</span>
                )}
              </div>

              <div className='form-group'>
                <label>Apellido Paterno *</label>
                <input
                  type='text'
                  value={formData.apellido_pat}
                  onChange={e =>
                    handleInputChange('apellido_pat', e.target.value)
                  }
                  className={errors.apellido_pat ? 'error' : ''}
                  placeholder='Ingresa el apellido paterno'
                />
                {errors.apellido_pat && (
                  <span className='error-text'>{errors.apellido_pat}</span>
                )}
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label>Apellido Materno</label>
                <input
                  type='text'
                  value={formData.apellido_mat}
                  onChange={e =>
                    handleInputChange('apellido_mat', e.target.value)
                  }
                  placeholder='Ingresa el apellido materno'
                />
              </div>

              <div className='form-group'>
                <label>Tipo de Relación</label>
                <select
                  value={formData.tipo_relacion}
                  onChange={e =>
                    handleInputChange('tipo_relacion', e.target.value)
                  }
                >
                  <option value=''>Selecciona un tipo</option>
                  {tipos.relacion?.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label>Empresa</label>
                <input
                  type='text'
                  value={formData.empresa}
                  onChange={e => handleInputChange('empresa', e.target.value)}
                  placeholder='Nombre de la empresa'
                />
              </div>

              <div className='form-group'>
                <label>Cargo</label>
                <input
                  type='text'
                  value={formData.cargo}
                  onChange={e => handleInputChange('cargo', e.target.value)}
                  placeholder='Cargo o posición'
                />
              </div>
            </div>

            <div className='form-group'>
              <label>Fecha de Nacimiento</label>
              <input
                type='date'
                value={formData.fecha_nacimiento}
                onChange={e =>
                  handleInputChange('fecha_nacimiento', e.target.value)
                }
              />
            </div>

            <div className='form-group'>
              <label>Notas</label>
              <textarea
                value={formData.notas}
                onChange={e => handleInputChange('notas', e.target.value)}
                placeholder='Notas adicionales sobre el contacto'
                rows={3}
              />
            </div>

            <div className='form-row'>
              <div className='form-group checkbox'>
                <label>
                  <input
                    type='checkbox'
                    checked={formData.favorito}
                    onChange={e =>
                      handleInputChange('favorito', e.target.checked)
                    }
                  />
                  ⭐ Marcar como favorito
                </label>
              </div>

              <div className='form-group checkbox'>
                <label>
                  <input
                    type='checkbox'
                    checked={formData.activo}
                    onChange={e =>
                      handleInputChange('activo', e.target.checked)
                    }
                  />
                  ✅ Contacto activo
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Teléfonos */}
        {currentTab === 'telefonos' && (
          <div className='tab-content'>
            <div className='section-header'>
              <h4>📞 Teléfonos</h4>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => addArrayItem('telefonos')}
              >
                ➕ Agregar Teléfono
              </button>
            </div>

            {formData.telefonos.map((telefono, index) => (
              <div key={index} className='array-item'>
                <div className='form-row'>
                  <div className='form-group'>
                    <label>Tipo</label>
                    <select
                      value={telefono.tipo_id}
                      onChange={e =>
                        handleArrayChange(
                          'telefonos',
                          index,
                          'tipo_id',
                          e.target.value
                        )
                      }
                    >
                      <option value=''>Selecciona tipo</option>
                      {tipos.telefono?.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Número</label>
                    <input
                      type='tel'
                      value={telefono.numero}
                      onChange={e =>
                        handleArrayChange(
                          'telefonos',
                          index,
                          'numero',
                          e.target.value
                        )
                      }
                      placeholder='Ej: +52 55 1234 5678'
                    />
                  </div>

                  <div className='form-actions'>
                    <button
                      type='button'
                      className={`btn-principal ${
                        telefono.principal ? 'active' : ''
                      }`}
                      onClick={() => setPrincipal('telefonos', index)}
                      title='Marcar como principal'
                    >
                      {telefono.principal ? '⭐' : '☆'}
                    </button>

                    {formData.telefonos.length > 1 && (
                      <button
                        type='button'
                        className='btn-remove'
                        onClick={() => removeArrayItem('telefonos', index)}
                        title='Eliminar teléfono'
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Emails */}
        {currentTab === 'emails' && (
          <div className='tab-content'>
            <div className='section-header'>
              <h4>✉️ Emails</h4>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => addArrayItem('emails')}
              >
                ➕ Agregar Email
              </button>
            </div>

            {formData.emails.map((email, index) => (
              <div key={index} className='array-item'>
                <div className='form-row'>
                  <div className='form-group'>
                    <label>Tipo</label>
                    <select
                      value={email.tipo_id}
                      onChange={e =>
                        handleArrayChange(
                          'emails',
                          index,
                          'tipo_id',
                          e.target.value
                        )
                      }
                    >
                      <option value=''>Selecciona tipo</option>
                      {tipos.email?.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Email</label>
                    <input
                      type='email'
                      value={email.email}
                      onChange={e =>
                        handleArrayChange(
                          'emails',
                          index,
                          'email',
                          e.target.value
                        )
                      }
                      className={errors[`email_${index}`] ? 'error' : ''}
                      placeholder='ejemplo@correo.com'
                    />
                    {errors[`email_${index}`] && (
                      <span className='error-text'>
                        {errors[`email_${index}`]}
                      </span>
                    )}
                  </div>

                  <div className='form-actions'>
                    <button
                      type='button'
                      className={`btn-principal ${
                        email.principal ? 'active' : ''
                      }`}
                      onClick={() => setPrincipal('emails', index)}
                      title='Marcar como principal'
                    >
                      {email.principal ? '⭐' : '☆'}
                    </button>

                    {formData.emails.length > 1 && (
                      <button
                        type='button'
                        className='btn-remove'
                        onClick={() => removeArrayItem('emails', index)}
                        title='Eliminar email'
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Direcciones */}
        {currentTab === 'direcciones' && (
          <div className='tab-content'>
            <div className='section-header'>
              <h4>🏠 Direcciones</h4>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => addArrayItem('direcciones')}
              >
                ➕ Agregar Dirección
              </button>
            </div>

            {formData.direcciones.map((direccion, index) => (
              <div key={index} className='array-item'>
                <div className='form-group'>
                  <label>Tipo</label>
                  <select
                    value={direccion.tipo_id}
                    onChange={e =>
                      handleArrayChange(
                        'direcciones',
                        index,
                        'tipo_id',
                        e.target.value
                      )
                    }
                  >
                    <option value=''>Selecciona tipo</option>
                    {tipos.direccion?.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>Calle y Número</label>
                  <input
                    type='text'
                    value={direccion.calle}
                    onChange={e =>
                      handleArrayChange(
                        'direcciones',
                        index,
                        'calle',
                        e.target.value
                      )
                    }
                    placeholder='Calle, número, colonia'
                  />
                </div>

                <div className='form-row'>
                  <div className='form-group'>
                    <label>Ciudad</label>
                    <input
                      type='text'
                      value={direccion.ciudad}
                      onChange={e =>
                        handleArrayChange(
                          'direcciones',
                          index,
                          'ciudad',
                          e.target.value
                        )
                      }
                      placeholder='Ciudad'
                    />
                  </div>

                  <div className='form-group'>
                    <label>Estado/Provincia</label>
                    <input
                      type='text'
                      value={direccion.estado_provincia}
                      onChange={e =>
                        handleArrayChange(
                          'direcciones',
                          index,
                          'estado_provincia',
                          e.target.value
                        )
                      }
                      placeholder='Estado o Provincia'
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group'>
                    <label>Código Postal</label>
                    <input
                      type='text'
                      value={direccion.codigo_postal}
                      onChange={e =>
                        handleArrayChange(
                          'direcciones',
                          index,
                          'codigo_postal',
                          e.target.value
                        )
                      }
                      placeholder='12345'
                    />
                  </div>

                  <div className='form-group'>
                    <label>País</label>
                    <input
                      type='text'
                      value={direccion.pais}
                      onChange={e =>
                        handleArrayChange(
                          'direcciones',
                          index,
                          'pais',
                          e.target.value
                        )
                      }
                      placeholder='País'
                    />
                  </div>
                </div>

                <div className='form-actions'>
                  <button
                    type='button'
                    className={`btn-principal ${
                      direccion.principal ? 'active' : ''
                    }`}
                    onClick={() => setPrincipal('direcciones', index)}
                    title='Marcar como principal'
                  >
                    {direccion.principal ? '⭐' : '☆'}
                  </button>

                  {formData.direcciones.length > 1 && (
                    <button
                      type='button'
                      className='btn-remove'
                      onClick={() => removeArrayItem('direcciones', index)}
                      title='Eliminar dirección'
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botones de acción */}
        <div className='form-footer'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={handleClose}
            disabled={loading}
          >
            ❌ Cancelar
          </button>
          <button type='submit' className='btn btn-primary' disabled={loading}>
            {loading
              ? '⏳ Guardando...'
              : isEditing
              ? '💾 Actualizar'
              : '➕ Crear Contacto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ContactModal
