import { NavLink, useLocation } from 'react-router-dom'
import { HiOutlineHome, HiOutlineUserAdd, HiOutlineUsers, HiOutlineChartBar, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import './Sidebar.css'

const navItems = [
  { path: '/', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/register', label: 'Register Farmer', icon: HiOutlineUserAdd },
  { path: '/farmers', label: 'Farmers', icon: HiOutlineUsers },
  { path: '/scoring', label: 'Scoring', icon: HiOutlineChartBar },
]

function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" />
              <path d="M20 8C13 14 9 24 20 34C31 24 27 14 20 8Z" fill="#0f1a12" opacity="0.8"/>
              <path d="M20 14L20 28" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 18L14 14" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M20 22L26 18" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {!collapsed && <span className="logo-text">KisanCred</span>}
        </div>
        <button className="btn btn-ghost btn-icon sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <HiOutlineChevronRight size={18} /> : <HiOutlineChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
            end={item.path === '/'}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} className="nav-icon" />
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {!collapsed && (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))) && (
              <div className="nav-active-indicator" />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-version">
            <span>KisanCred v1.0</span>
            <span className="badge badge-success">PWA</span>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
