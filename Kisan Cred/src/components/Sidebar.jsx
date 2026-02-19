import { NavLink } from 'react-router-dom'
import { HiOutlineHome, HiOutlineCash, HiOutlineChartBar, HiOutlineUser, HiOutlineCog } from 'react-icons/hi'
import './Sidebar.css'

const navItems = [
  { path: '/', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/loans', label: 'Loan Schemes', icon: HiOutlineCash },
  { path: '/score', label: 'Credit Score', icon: HiOutlineChartBar },
  { path: '/profile', label: 'My Profile', icon: HiOutlineUser },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog },
]

function Sidebar() {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <svg className="sidebar-logo-icon" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" fill="url(#sLogo)" />
          <path d="M20 8C13 14 9 24 20 34C31 24 27 14 20 8Z" fill="#0a1f0d" opacity="0.8"/>
          <path d="M20 14L20 28" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 18L14 14" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M20 22L26 18" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
          <defs>
            <linearGradient id="sLogo" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
        </svg>
        <span className="sidebar-logo-text">KisanCred</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <item.icon className="sidebar-link-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-version">KisanCred v1.0</span>
        <span className="badge badge-success">PWA</span>
      </div>
    </aside>
  )
}

export default Sidebar
