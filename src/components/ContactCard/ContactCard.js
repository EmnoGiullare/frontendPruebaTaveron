import React from 'react'
import './ContactCard.css'

const ContactCard = ({
  contacto,
  vista,
  onEdit,
  onDelete,
  onToggleFavorito
}) => {
  const formatTelefono = telefonos => {
    if (!telefonos || telefonos.length === 0) return 'Sin teléfono'
    const principal = telefonos.find(tel => tel.principal) || telefonos[0]
    return principal.numero
  }

  const formatEmail = emails => {
    if (!emails || emails.length === 0) return 'Sin email'
    const principal = emails.find(email => email.principal) || emails[0]
    return principal.email
  }

  const formatDireccion = direcciones => {
    if (!direcciones || direcciones.length === 0) return 'Sin dirección'
    const principal = direcciones.find(dir => dir.principal) || direcciones[0]

    if (principal.direccion_completa) {
      return principal.direccion_completa
    }

    const calle = principal.calle || ''
    const ciudad = principal.ciudad || ''
    return calle && ciudad
      ? `${calle}, ${ciudad}`
      : calle || ciudad || 'Sin dirección'
  }

  const formatTipoRelacion = tipoRelacion => {
    if (!tipoRelacion) return ''
    // Manejar tipo_relacion como objeto o string
    return typeof tipoRelacion === 'object' ? tipoRelacion.nombre : tipoRelacion
  }

  const getInitials = (nombre, apellido) => {
    const inicial1 = nombre?.charAt(0)?.toUpperCase() || ''
    const inicial2 = apellido?.charAt(0)?.toUpperCase() || ''
    return inicial1 + inicial2 || '??'
  }

  if (vista === 'list') {
    return (
      <div className='contact-card list'>
        <div className='contact-avatar'>
          {getInitials(contacto.nombre, contacto.apellido_pat)}
        </div>

        <div className='contact-info'>
          <div className='contact-name'>
            {contacto.nombre_completo}
            {contacto.favorito && <span className='favorite-star'>⭐</span>}
          </div>
          <div className='contact-details'>
            <span className='company'>{contacto.empresa || 'Sin empresa'}</span>
            <span className='position'>{contacto.cargo || 'Sin cargo'}</span>
          </div>
        </div>

        <div className='contact-secondary'>
          <div className='contact-phone'>
            {formatTelefono(contacto.telefonos)}
          </div>
          <div className='contact-email'>{formatEmail(contacto.emails)}</div>
        </div>

        <div className='contact-actions'>
          <button
            className={`btn-favorite ${contacto.favorito ? 'active' : ''}`}
            onClick={() => onToggleFavorito(contacto.id)}
            title={
              contacto.favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'
            }
          >
            {contacto.favorito ? '⭐' : '☆'}
          </button>
          <button
            className='btn-edit'
            onClick={() => onEdit(contacto)}
            title='Editar contacto'
          >
            ✏️
          </button>
          <button
            className='btn-delete'
            onClick={() => onDelete(contacto)}
            title='Eliminar contacto'
          >
            🗑️
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='contact-card grid'>
      <div className='card-header'>
        <div className='contact-avatar large'>
          {getInitials(contacto.nombre, contacto.apellido_pat)}
        </div>
        <button
          className={`btn-favorite ${contacto.favorito ? 'active' : ''}`}
          onClick={() => onToggleFavorito(contacto.id)}
        >
          {contacto.favorito ? '⭐' : '☆'}
        </button>
      </div>

      <div className='card-body'>
        <h3 className='contact-name'>{contacto.nombre_completo}</h3>

        <div className='contact-company'>
          <strong>{contacto.empresa || 'Sin empresa'}</strong>
        </div>

        <div className='contact-position'>{contacto.cargo || 'Sin cargo'}</div>

        <div className='contact-details'>
          <div className='contact-phone'>
            📞 {formatTelefono(contacto.telefonos)}
          </div>
          <div className='contact-email'>✉️ {formatEmail(contacto.emails)}</div>
          <div className='contact-address'>
            🏠 {formatDireccion(contacto.direcciones)}
          </div>

          {contacto.tipo_relacion && (
            <div className='contact-type'>
              👥 {formatTipoRelacion(contacto.tipo_relacion)}
            </div>
          )}
        </div>

        {contacto.notas && (
          <div className='contact-notes'>
            📝 {contacto.notas.substring(0, 50)}
            {contacto.notas.length > 50 && '...'}
          </div>
        )}
      </div>

      <div className='card-footer'>
        <button className='btn btn-secondary' onClick={() => onEdit(contacto)}>
          ✏️ Editar
        </button>
        <button className='btn btn-danger' onClick={() => onDelete(contacto)}>
          🗑️ Eliminar
        </button>
      </div>
    </div>
  )
}

export default ContactCard
