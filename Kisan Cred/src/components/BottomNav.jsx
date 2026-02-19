import { NavLink } from 'react-router-dom'
import { HiOutlineHome, HiOutlineViewGrid, HiOutlineChartBar, HiOutlineUser, HiOutlineQuestionMarkCircle } from 'react-icons/hi'
import './BottomNav.css'

const tabs = [
  { path: '/', label: 'Home', icon: HiOutlineHome },
  { path: '/services', label: 'Services', icon: HiOutlineViewGrid },
  { path: '/score', label: 'Score', icon: HiOutlineChartBar },
  { path: '/help', label: 'Help', icon: HiOutlineQuestionMarkCircle },
  { path: '/profile', label: 'Profile', icon: HiOutlineUser },
]

function BottomNav() {
  return (
    <nav className="bottom-nav" id="bottom-nav">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          end={tab.path === '/'}
        >
          <tab.icon className="nav-tab-icon" />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
