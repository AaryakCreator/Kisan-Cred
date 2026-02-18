import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, createContext } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import RegisterFarmer from './pages/RegisterFarmer'
import FarmersList from './pages/FarmersList'
import FarmerDetail from './pages/FarmerDetail'
import Scoring from './pages/Scoring'

export const ThemeContext = createContext()

function App() {
  const [theme, setTheme] = useState('dark')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <Topbar onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<RegisterFarmer />} />
              <Route path="/farmers" element={<FarmersList />} />
              <Route path="/farmers/:id" element={<FarmerDetail />} />
              <Route path="/scoring" element={<Scoring />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}

export default App
