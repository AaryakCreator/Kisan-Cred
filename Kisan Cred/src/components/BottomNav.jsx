import { NavLink } from 'react-router-dom'
import { HiOutlineHome, HiOutlineCash, HiOutlineChartBar, HiOutlineUser, HiOutlineClipboardList } from 'react-icons/hi'
import './BottomNav.css'

const tabs = [
  { path: '/', label: 'Home', icon: HiOutlineHome },
  { path: '/loans', label: 'Loans', icon: HiOutlineCash },
  { path: '/score', label: 'Score', icon: HiOutlineChartBar },
  { path: '/applications', label: 'Applied', icon: HiOutlineClipboardList },
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
