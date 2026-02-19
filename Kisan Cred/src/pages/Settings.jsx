import { useContext } from 'react'
import { HiOutlineMoon, HiOutlineSun, HiOutlineGlobe, HiOutlineDatabase, HiOutlineDownload, HiOutlineInformationCircle } from 'react-icons/hi'
import { ThemeContext } from '../App'
import './Settings.css'

function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your KisanCred experience</p>
      </div>

      {/* Appearance */}
      <div className="card settings-section animate-slide-up">
        <h3><HiOutlineMoon size={16} /> Appearance</h3>
        <div className="toggle-wrap">
          <div className="toggle-label">
            <div className="toggle-label-icon">
              {theme === 'dark' ? <HiOutlineMoon size={16} /> : <HiOutlineSun size={16} />}
            </div>
            <span>Dark Mode</span>
          </div>
          <button
            className={`toggle-switch ${theme === 'dark' ? 'on' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            <div className="toggle-knob" />
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="card settings-section mt-16 animate-slide-up">
        <h3><HiOutlineGlobe size={16} /> Language</h3>
        <div className="toggle-wrap">
          <div className="toggle-label">
            <div className="toggle-label-icon"><HiOutlineGlobe size={16} /></div>
            <span>English</span>
          </div>
          <span className="badge badge-success">Active</span>
        </div>
        <div className="toggle-wrap">
          <div className="toggle-label">
            <div className="toggle-label-icon" style={{ fontSize: '0.85rem', fontWeight: 700 }}>हि</div>
            <span>हिन्दी</span>
          </div>
          <span className="badge badge-info">Coming Soon</span>
        </div>
      </div>

      {/* Data & Offline */}
      <div className="card settings-section mt-16 animate-slide-up">
        <h3><HiOutlineDatabase size={16} /> Data & Offline</h3>
        <div className="toggle-wrap">
          <div className="toggle-label">
            <div className="toggle-label-icon"><HiOutlineDatabase size={16} /></div>
            <span>Offline Mode</span>
          </div>
          <button className="toggle-switch on" aria-label="Toggle offline mode">
            <div className="toggle-knob" />
          </button>
        </div>
        <div className="toggle-wrap">
          <div className="toggle-label">
            <div className="toggle-label-icon"><HiOutlineDownload size={16} /></div>
            <span>Cache Size</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>2.4 MB</span>
        </div>
      </div>

      {/* Install PWA */}
      <div className="install-prompt mt-16 animate-slide-up">
        <p>Install KisanCred on your device for offline access</p>
        <button className="btn btn-primary btn-block">
          <HiOutlineDownload size={16} /> Install App
        </button>
        <div style={{ marginTop: 12, borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
          <p style={{ marginBottom: 8 }}>Register a new farmer profile?</p>
          <a href="/onboarding" className="btn btn-secondary btn-block" style={{ textDecoration: 'none', textAlign: 'center' }}>
            <HiOutlineUser size={16} /> Register New Farmer
          </a>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card settings-section mt-16 animate-slide-up" style={{ borderColor: 'var(--border-primary)' }}>
        <h3>Account</h3>
        <button 
          className="btn btn-block" 
          style={{ 
            marginTop: 8, 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            border: '1px solid rgba(239, 68, 68, 0.2)' 
          }}
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
              localStorage.removeItem('kisan_farmer_id')
              window.location.href = '/' // Force reload to clear state
            }
          }}
        >
          Logout
        </button>
      </div>

      {/* App Info */}
      <div className="card settings-app-info mt-16 animate-scale">
        <svg className="settings-app-logo" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" fill="url(#setLogo)" />
          <path d="M20 8C13 14 9 24 20 34C31 24 27 14 20 8Z" fill="#0a1f0d" opacity="0.8"/>
          <path d="M20 14L20 28" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 18L14 14" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M20 22L26 18" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
          <defs>
            <linearGradient id="setLogo" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
        </svg>
        <div className="settings-app-name">KisanCred</div>
        <div className="settings-app-version">Version 1.0.0 · Built for Farmers</div>
        <div className="settings-app-badges">
          <span className="badge badge-success">PWA</span>
          <span className="badge badge-info">Offline Ready</span>
          <span className="badge badge-purple">Low Bandwidth</span>
        </div>
      </div>
    </div>
  )
}

export default Settings
