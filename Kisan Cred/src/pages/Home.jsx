import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineUserAdd, HiOutlineLightningBolt, HiOutlineTrendingUp, HiOutlineCash, HiOutlineCalendar, HiOutlineChartBar, HiOutlineArrowRight } from 'react-icons/hi'
import CreditGauge from '../components/CreditGauge'
import { getFarmerProfile, getQuickStats, getLoanSchemes } from '../services/api'
import './Home.css'

function Home() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [topLoans, setTopLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const navigate = useNavigate()

  // Check for session on mount
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
    Promise.all([getFarmerProfile(), getQuickStats(), getLoanSchemes()])
      .then(([p, s, l]) => {
        setProfile(p)
        setStats(s)
        setTopLoans(l.filter(loan => loan.eligibility === 'eligible').slice(0, 4))
        setLoading(false)
      })
      .catch(err => {
        console.error('Home load error:', err)
        setError(err.message || 'Failed to load data')
        setLoading(false)
      })
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    // api.js will auto-bootstrap if we call a getter like loadDashboard
    await loadDashboard()
    setIsGuest(false)
  }

  if (isGuest) {
    return (
      <div className="page welcome-page">
        <div className="welcome-hero animate-scale">
          <div className="logo-large">🌾</div>
          <h1>Kisan Cred</h1>
          <p>Credit & Loans for Modern Farmers</p>
        </div>
        
        <div className="welcome-actions animate-slide-up">
          <Link to="/onboarding" className="btn btn-primary btn-lg btn-block" style={{ textDecoration: 'none', justifyContent: 'center' }}>
            <HiOutlineUserAdd size={20} /> Register New Farmer
          </Link>
          <div className="divider"><span>OR</span></div>
          <button className="btn btn-secondary btn-lg btn-block" onClick={handleDemoLogin}>
            <HiOutlineLightningBolt size={20} /> Try Demo Mode
          </button>
        </div>

        <div className="welcome-features mt-20 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="feature-item">
            <span>📊</span> Check Credit Score
          </div>
          <div className="feature-item">
            <span>💰</span> Apply for KCC Loans
          </div>
          <div className="feature-item">
            <span>📝</span> Digital Farm Profile
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ marginBottom: 8 }}>Unable to load dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadDashboard}>Retry</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="skeleton skeleton-circle" style={{ margin: '0 auto 16px', width: 140, height: 140 }} />
          <div className="skeleton skeleton-line medium" style={{ margin: '0 auto 8px' }} />
          <div className="skeleton skeleton-line short" style={{ margin: '0 auto' }} />
        </div>
        <div className="grid-2" style={{ marginTop: 20 }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div className="skeleton skeleton-line short" />
              <div className="skeleton skeleton-line" style={{ height: 24, marginTop: 8 }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {/* Credit Score Gauge */}
      <div className="home-gauge-section animate-scale">
        <CreditGauge score={profile.score} size={160} />
        <p className="home-gauge-label">Your Kisan Credit Score</p>
      </div>

      {/* Quick Stats */}
      <div className="grid-2 stagger mb-20" style={{ marginTop: 20 }}>
        <div className="card stat-card green animate-slide-up">
          <div className="stat-icon green"><HiOutlineTrendingUp size={18} /></div>
          <div className="stat-label">Loan Eligibility</div>
          <div className="stat-value green">{stats.loanEligibility}%</div>
          <div className="stat-sub up">↑ High</div>
        </div>
        <div className="card stat-card amber animate-slide-up">
          <div className="stat-icon amber"><HiOutlineCash size={18} /></div>
          <div className="stat-label">Active Loans</div>
          <div className="stat-value amber">{stats.activeLoans}</div>
          <div className="stat-sub">{stats.totalDisbursed} disbursed</div>
        </div>
        <div className="card stat-card cyan animate-slide-up">
          <div className="stat-icon cyan"><HiOutlineCalendar size={18} /></div>
          <div className="stat-label">Next EMI</div>
          <div className="stat-value cyan">{stats.nextEMI}</div>
          <div className="stat-sub">Due {stats.nextEMIDate}</div>
        </div>
        <div className="card stat-card purple animate-slide-up">
          <div className="stat-icon purple"><HiOutlineChartBar size={18} /></div>
          <div className="stat-label">Score Trend</div>
          <div className="stat-value purple">+16</div>
          <div className="stat-sub up">↑ Last 6 months</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="home-quick-actions mb-20">
        <button className="btn btn-primary" onClick={() => navigate('/loans')}>
          <HiOutlineCash size={16} /> Find Loans
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/score')}>
          <HiOutlineChartBar size={16} /> Score Details
        </button>
      </div>

      {/* Top Loan Recommendations */}
      <div className="section-header">
        <span className="section-title">Recommended Loans</span>
        <button className="section-link" onClick={() => navigate('/loans')}>
          View All <HiOutlineArrowRight size={12} />
        </button>
      </div>
      <div className="h-scroll home-loan-scroll">
        {topLoans.map((loan, i) => (
          <div key={loan.id} className="card home-loan-card card-interactive animate-slide-right" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="home-loan-name">{loan.name}</div>
            <div className="home-loan-provider">{loan.provider}</div>
            <div className="home-loan-row">
              <div className="home-loan-rate">
                {loan.interestRate}% <span>p.a.</span>
              </div>
              <span className="badge badge-success">{loan.eligibility}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
              Up to ₹{(loan.maxAmount / 100000).toFixed(1)}L · {loan.tenure}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
