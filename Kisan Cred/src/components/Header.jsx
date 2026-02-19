import { useContext } from 'react'
import { HiOutlineBell, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi'
import { ThemeContext } from '../App'
import './Header.css'

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <header className="app-header" id="app-header">
      <div className="header-greeting">
        <div className="header-avatar">RK</div>
        <div className="header-text">
          <h3>Namaste, Rajesh 🌾</h3>
          <span>Ludhiana, Punjab</span>
        </div>
      </div>
      <div className="header-actions">
        <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
        </button>
        <button className="btn btn-ghost btn-icon notification-btn" aria-label="Notifications">
          <HiOutlineBell size={20} />
          <span className="notification-dot" />
        </button>
      </div>
    </header>
  )
}

export default Header
