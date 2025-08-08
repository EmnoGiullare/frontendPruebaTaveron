import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Layout.css'

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  const closeDrawer = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeDrawer()
  }

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊'
    },
    {
      path: '/profile',
      label: 'Perfil',
      icon: '👤'
    }
  ]

  return (
    <div className='layout'>
      {/* Header */}
      <header className='layout-header'>
        <button
          className='menu-button'
          onClick={toggleDrawer}
          aria-label='Abrir menú'
        >
          ☰
        </button>
        <h1 className='app-title'>Agenda App</h1>
        <div className='user-info-header'>
          <span>Hola, {user?.first_name || user?.username}</span>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && <div className='drawer-overlay' onClick={closeDrawer} />}

      {/* Navigation Drawer */}
      <nav className={`navigation-drawer ${isOpen ? 'open' : ''}`}>
        <div className='drawer-header'>
          <div className='user-avatar'>
            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || '?'}
          </div>
          <div className='user-details'>
            <h3>
              {user?.first_name} {user?.last_name}
            </h3>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className='drawer-content'>
          <ul className='menu-list'>
            {menuItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`menu-item ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  onClick={closeDrawer}
                >
                  <span className='menu-icon'>{item.icon}</span>
                  <span className='menu-label'>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='drawer-footer'>
          <button className='logout-button' onClick={handleLogout}>
            <span className='menu-icon'>🚪</span>
            <span className='menu-label'>Cerrar Sesión</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`main-content ${isOpen ? 'shifted' : ''}`}>
        {children}
      </main>
    </div>
  )
}

export default Layout
