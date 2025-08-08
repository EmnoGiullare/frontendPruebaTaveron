import React, { useEffect } from 'react'
import './Modal.css'

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = event => {
      if (event.keyCode === 27) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div
        className={`modal-container modal-${size}`}
        onClick={e => e.stopPropagation()}
      >
        <div className='modal-header'>
          <h3 className='modal-title'>{title}</h3>
          <button
            className='modal-close-button'
            onClick={onClose}
            aria-label='Cerrar modal'
          >
            ✕
          </button>
        </div>
        <div className='modal-body'>{children}</div>
      </div>
    </div>
  )
}

export default Modal
