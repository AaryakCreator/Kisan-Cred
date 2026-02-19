import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, createContext } from 'react'
import BottomNav from './components/BottomNav'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Loans from './pages/Loans'
import ScoreInsights from './pages/ScoreInsights'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import MyApplications from './pages/MyApplications'
import Onboarding from './pages/Onboarding'

export const ThemeContext = createContext()

function App() {
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <BrowserRouter>
        <div className="app-shell">
          <Sidebar />
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/score" element={<ScoreInsights />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/onboarding" element={<Onboarding />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}

export default App
