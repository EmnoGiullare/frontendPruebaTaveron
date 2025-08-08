import React, { useEffect } from 'react'
import Modal from '../Modal/Modal'
import './ConfirmModal.css'

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger', // danger, warning, info
  loading = false
}) => {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = event => {
      if (event.keyCode === 27 && !loading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, loading])

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️'
      case 'warning':
        return '⚡'
      case 'info':
        return 'ℹ️'
      default:
        return '❓'
    }
  }

  const handleConfirm = () => {
    if (!loading) {
      onConfirm()
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size='small'>
      <div className={`confirm-modal confirm-modal-${type}`}>
        <div className='confirm-icon'>{getIcon()}</div>

        <div className='confirm-message'>
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        <div className='confirm-actions'>
          <button
            className={`btn btn-${type}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? '⏳ Procesando...' : confirmText}
          </button>
          <button
            className='btn btn-secondary'
            onClick={handleClose}
            disabled={loading}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
