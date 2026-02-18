import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HiOutlineArrowLeft, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineShieldCheck, HiOutlineCube, HiOutlineChartBar } from 'react-icons/hi'
import { getFarmer, getScoreBreakdown } from '../services/api'
import './FarmerDetail.css'

function FarmerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [farmer, setFarmer] = useState(null)
  const [scores, setScores] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getFarmer(id), getScoreBreakdown(id)]).then(([f, s]) => {
      setFarmer(f)
      setScores(s)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="page-container">
        <div className="detail-loading">
          <div className="skeleton-line" style={{ width: 200 }} />
          <div className="skeleton-line short" style={{ width: 300 }} />
        </div>
      </div>
    )
  }

  if (!farmer) {
    return (
      <div className="page-container">
        <div className="detail-empty">
          <h2>Farmer not found</h2>
          <p>The farmer with ID "{id}" doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/farmers')}>Go to Farmers</button>
        </div>
      </div>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e'
    if (score >= 70) return '#06b6d4'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Average'
    return 'Poor'
  }

  const statusMap = { active: 'badge-success', pending: 'badge-warning', suspended: 'badge-danger' }

  const circumference = 2 * Math.PI * 62
  const dashOffset = circumference - (farmer.score / 100) * circumference

  return (
    <div className="page-container">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/farmers')}>
        <HiOutlineArrowLeft size={16} /> Back to Farmers
      </button>

      {/* Profile Header */}
      <div className="detail-header card-static animate-fade">
        <div className="detail-header-left">
          <div className="detail-avatar" style={{ background: `linear-gradient(135deg, ${getScoreColor(farmer.score)}, ${getScoreColor(farmer.score)}88)` }}>
            {farmer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="detail-info">
            <div className="detail-name-row">
              <h1>{farmer.name}</h1>
              <span className={`badge ${statusMap[farmer.status]}`}>{farmer.status}</span>
            </div>
            <div className="detail-meta">
              <span><HiOutlineLocationMarker size={14} /> {farmer.location}, {farmer.region}</span>
              <span><HiOutlineCalendar size={14} /> Registered {new Date(farmer.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Score Gauge */}
        <div className="detail-score-gauge">
          <svg viewBox="0 0 140 140" className="gauge-svg">
            <circle cx="70" cy="70" r="62" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
            <circle
              cx="70" cy="70" r="62" fill="none"
              stroke={getScoreColor(farmer.score)}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1.2s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <div className="gauge-center">
            <span className="gauge-value" style={{ color: getScoreColor(farmer.score) }}>{farmer.score}</span>
            <span className="gauge-label">{getScoreLabel(farmer.score)}</span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid-3" style={{ marginTop: 24 }}>
        <div className="card animate-slide-up">
          <h3><HiOutlineCube size={18} /> Farm Details</h3>
          <div className="info-list">
            <div className="info-row"><span>Farm Size</span><span>{farmer.farmSize} acres</span></div>
            <div className="info-row"><span>Region</span><span>{farmer.region}</span></div>
            <div className="info-row"><span>Crops</span>
              <div className="info-crops">{farmer.crops.map(c => <span key={c} className="badge badge-success">{c}</span>)}</div>
            </div>
          </div>
        </div>

        <div className="card animate-slide-up">
          <h3><HiOutlineShieldCheck size={18} /> Verification</h3>
          <div className="info-list">
            <div className="info-row"><span>Wallet</span><code className="wallet-code">{farmer.walletAddress}</code></div>
            <div className="info-row"><span>Data Integrity</span><span className="badge badge-info">Verified</span></div>
            <div className="info-row"><span>Last Activity</span><span>{new Date(farmer.lastActivity).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div>
          </div>
        </div>

        <div className="card animate-slide-up">
          <h3><HiOutlineChartBar size={18} /> Score Breakdown</h3>
          {scores && (
            <div className="score-factors">
              {Object.entries(scores.factors).map(([key, value]) => (
                <div key={key} className="factor-row">
                  <div className="factor-header">
                    <span className="factor-name">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                    <span className="factor-value">{value}</span>
                  </div>
                  <div className="factor-bar">
                    <div className="factor-fill" style={{ width: `${value}%`, background: getScoreColor(value) }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export default FarmerDetail
