import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineUserAdd, HiOutlineLightningBolt, HiOutlineTrendingUp, HiOutlineCash, HiOutlineCalendar, HiOutlineChartBar, HiOutlineArrowRight, HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineShoppingBag, HiOutlineCheckCircle, HiOutlineExclamation } from 'react-icons/hi'
import CreditGauge from '../components/CreditGauge'
import { getFarmerProfile, getQuickStats, getLoanSchemes } from '../services/api'
import './Home.css'

function Home() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const id = localStorage.getItem('kisan_farmer_id')
    if (!id) {
      setIsGuest(true)
      setLoading(false)
    } else {
      loadDashboard()
    }
  }, [])

  const loadDashboard = () => {
    setLoading(true)
    setError(null)
    Promise.all([getFarmerProfile(), getQuickStats()])
      .then(([p, s]) => {
        setProfile(p)
        setStats(s)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Failed to load data')
        setLoading(false)
      })
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    await loadDashboard()
    setIsGuest(false)
  }

  if (loading) {
    return (
      <div className="page center-content">
        <div className="spinner"></div>
      </div>
    )
  }

  // --- GUEST VIEW (Landing Page) ---
  if (isGuest) {
    return (
      <div className="page landing-page">
        <div className="landing-hero animate-fade">
          <div className="logo-badge">🚜</div>
          <h1>KisanCred</h1>
          <p>Building a data-driven future for India's farmers.</p>
        </div>

        <div className="landing-actions animate-slide-up">
          <Link to="/onboarding" className="btn btn-primary btn-block btn-lg">
            Register New Farmer
          </Link>
          <button className="btn btn-secondary btn-block btn-lg mt-3" onClick={handleDemoLogin}>
            Try Demo Mode
          </button>
        </div>

        {/* How It Works (Landing) */}
        <div className="how-it-works mt-24 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h3 className="section-title text-center mb-16">How KisanCred Works</h3>
          {[
            { step: 1, title: 'Simple Registration', desc: 'Sign up with Aadhaar & basic details.' },
            { step: 2, title: 'Link Farm Data', desc: 'Connect land records & harvest data.' },
            { step: 3, title: 'Get Credit Score', desc: 'Receive your AI-powered score instantly.' },
            { step: 4, title: 'Get Loans', desc: 'Apply for low-interest loans from banks.' }
          ].map((item, i) => (
            <div key={i} className="step-item">
              <div className="step-number">{item.step}</div>
              <div className="step-content">
                <div className="step-title">{item.title}</div>
                <div className="step-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // --- DASHBOARD VIEW (Logged In) ---
  if (error) {
    return (
      <div className="page center-content">
        <div className="error-state">
          <HiOutlineExclamation size={48} className="text-danger" />
          <h3>Unable to load dashboard</h3>
          <button className="btn btn-primary mt-4" onClick={loadDashboard}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page dashboard-page">
      {/* Hero / Credit Snapshot */}
      <div className="hero-section animate-fade">
        <div className="hero-content">
          <h2>AI-Powered Credit Score</h2>
          <p>Fair credit access based on your farm data.</p>
          <button className="btn btn-primary btn-sm mt-2" onClick={() => navigate('/score')}>
            Check Your Score <HiOutlineArrowRight />
          </button>
        </div>
        <div className="hero-gauge">
          <CreditGauge score={profile.score} size={110} />
          <div className="gauge-status badge badge-success">Excellent</div>
        </div>
      </div>

      {/* Quick Services Grid */}
      <div className="section-header mt-24">
        <h3 className="section-title">Quick Services</h3>
      </div>
      <div className="services-grid-mini animate-slide-up">
        <Link to="/score" className="service-item card">
          <div className="service-icon green"><HiOutlineTrendingUp /></div>
          <span>Check Score</span>
        </Link>
        <Link to="/profile" className="service-item card">
          <div className="service-icon amber"><HiOutlineUserAdd /></div>
          <span>Farmer Reg</span>
        </Link>
        <Link to="/loans" className="service-item card">
          <div className="service-icon cyan"><HiOutlineCash /></div>
          <span>Apply Loans</span>
        </Link>
        <div className="service-item card opacity-50">
          <div className="service-icon purple"><HiOutlineShoppingBag /></div>
          <span>Market</span>
        </div>
        <div className="service-item card opacity-50">
          <div className="service-icon blue"><HiOutlineUserGroup /></div>
          <span>Advisory</span>
        </div>
        <div className="service-item card opacity-50">
          <div className="service-icon rose"><HiOutlineShieldCheck /></div>
          <span>Insurance</span>
        </div>
      </div>

      {/* AI Risk Analysis */}
      <div className="card risk-card mt-24 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="risk-header">
          <h3>AI Risk Analysis</h3>
          <span className="badge badge-success">Low Risk</span>
        </div>
        
        <div className="risk-bars mt-4">
          <div className="risk-bar-item">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white-opacity">Land Stability</span>
              <span className="text-accent">High Impact</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill green" style={{ width: '85%' }} />
            </div>
          </div>
          
          <div className="risk-bar-item mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white-opacity">Crop Diversification</span>
              <span className="text-success">Good</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill green" style={{ width: '70%' }} />
            </div>
          </div>

          <div className="risk-bar-item mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white-opacity">Market Resilience</span>
              <span className="text-warning">Moderate</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill amber" style={{ width: '55%' }} />
            </div>
          </div>
        </div>

        <div className="risk-factors mt-4 pt-4 border-top-white-opacity">
          <div className="flex gap-2 items-start text-xs text-white-opacity mb-2">
            <HiOutlineCheckCircle className="text-success shrink-0" size={14} />
            <span>Strong Crop History: Consistent yields over 4 seasons.</span>
          </div>
          <div className="flex gap-2 items-start text-xs text-white-opacity">
            <HiOutlineExclamation className="text-warning shrink-0" size={14} />
            <span>Climate Vulnerability: Moderate risk in your region.</span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="footer-brand mt-32 mb-8 text-center opacity-50">
        <div className="logo-small mb-2">🚜 KisanCred</div>
        <p className="text-xs">Empowering Rural Prosperity</p>
      </div>
    </div>
  )
}

export default Home
