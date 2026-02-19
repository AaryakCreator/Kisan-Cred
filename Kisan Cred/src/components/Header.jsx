import { useContext } from 'react'
import { HiOutlineBell, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi'
import { ThemeContext } from '../App'
import './Header.css'

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <header className="app-header" id="app-header" style={{ background: 'var(--bg-header)', color: 'white' }}>
      <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Tractor Icon SVG */}
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: 6, borderRadius: 8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>KisanCred</h1>
      </div>

      <div className="header-actions">
        {/* Theme Toggle (Optional, maybe hidden in design but useful) */}
        <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Toggle theme" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {theme === 'dark' ? <HiOutlineSun size={22} /> : <HiOutlineMoon size={22} />}
        </button>
        <button className="btn btn-ghost btn-icon notification-btn" aria-label="Notifications" style={{ color: 'rgba(255,255,255,0.9)' }}>
          <HiOutlineBell size={22} />
          <span className="notification-dot" style={{ background: 'var(--accent-warning)', border: '2px solid var(--bg-header)' }} />
        </button>
      </div>
    </header>
  )
}

export default Header
