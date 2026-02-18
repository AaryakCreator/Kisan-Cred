import { useContext } from 'react'
import { HiOutlineMenu, HiOutlineBell, HiOutlineMoon, HiOutlineSun, HiOutlineSearch } from 'react-icons/hi'
import { ThemeContext } from '../App'
import './Topbar.css'

function Topbar({ onMenuToggle }) {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="btn btn-ghost btn-icon mobile-menu" onClick={onMenuToggle} aria-label="Menu">
          <HiOutlineMenu size={20} />
        </button>
        <div className="search-wrapper">
          <HiOutlineSearch size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search farmers, regions..."
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
        </button>
        <button className="btn btn-ghost btn-icon notification-btn" aria-label="Notifications">
          <HiOutlineBell size={20} />
          <span className="notification-dot" />
        </button>
        <div className="topbar-avatar">
          <div className="avatar-circle">
            <span>AS</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
