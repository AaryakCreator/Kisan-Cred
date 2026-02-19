import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js'
import CreditGauge from '../components/CreditGauge'
import { getCreditScore, getImprovementTips } from '../services/api'
import './ScoreInsights.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

function ScoreInsights() {
  const [scoreData, setScoreData] = useState(null)
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = () => {
    setLoading(true)
    setError(null)
    Promise.all([getCreditScore(), getImprovementTips()])
      .then(([sd, t]) => {
        setScoreData(sd)
        setTips(t)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => { loadData() }, [])

  const getColor = (v) => {
    if (v >= 90) return '#22c55e'
    if (v >= 70) return '#06b6d4'
    if (v >= 50) return '#f59e0b'
    return '#ef4444'
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-header"><h1>Credit Score</h1></div>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ marginBottom: 8 }}>Unable to load score</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>Retry</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page-header"><h1>Credit Score</h1></div>
        <div className="skeleton skeleton-circle" style={{ width: 140, height: 140, margin: '20px auto' }} />
        <div className="card" style={{ marginTop: 20, padding: 18 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div className="skeleton skeleton-line short" />
              <div className="skeleton skeleton-line" style={{ marginTop: 6, height: 8 }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalPotential = scoreData.factors.reduce((sum, f) => sum + f.improvement, 0)

  const chartData = {
    labels: scoreData.history.map(h => h.month),
    datasets: [{
      data: scoreData.history.map(h => h.score),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.08)',
      borderWidth: 2.5,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#22c55e',
      pointBorderColor: 'var(--bg-primary)',
      pointBorderWidth: 2,
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 31, 13, 0.9)',
        titleColor: '#e4f0e6',
        bodyColor: '#96b8a0',
        borderColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(74, 222, 128, 0.04)' },
        ticks: { color: '#5e8568', font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(74, 222, 128, 0.04)' },
        ticks: { color: '#5e8568', font: { family: 'Inter', size: 11 } },
        min: 40,
        max: 100,
      }
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Credit Score</h1>
        <p>Detailed breakdown of your Kisan credit score</p>
      </div>

      {/* Overall Score */}
      <div className="score-overview animate-scale">
        <CreditGauge score={scoreData.overall} size={150} />
        <p className="score-overall-label">Overall Credit Score</p>
      </div>

      {/* Score Factors */}
      <div className="card score-factors-section mt-16 animate-slide-up">
        <h3 style={{ marginBottom: 4 }}>Score Factors</h3>
        {scoreData.factors.map((f, i) => (
          <div key={f.key} className="factor-bar-wrap" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="factor-bar-header">
              <span className="factor-bar-label">{f.label}</span>
              <span className="factor-bar-value" style={{ color: getColor(f.value) }}>
                {f.value}
                {f.improvement > 0 && (
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', marginLeft: 4 }}>
                    +{f.improvement}
                  </span>
                )}
              </span>
            </div>
            <div className="factor-bar">
              <div className="factor-bar-fill" style={{ width: `${f.value}%`, background: getColor(f.value) }} />
            </div>
          </div>
        ))}

        <div className="score-total-potential">
          <div className="score-total-potential-value">+{totalPotential} pts</div>
          <div className="score-total-potential-label">Potential improvement available</div>
        </div>
      </div>

      {/* Score History Chart */}
      <div className="card score-chart-section mt-16 animate-slide-up">
        <h3>Score Trend</h3>
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Improvement Tips */}
      <div className="section-header mt-16">
        <span className="section-title">Improve Your Score</span>
      </div>
      <div className="tips-section stagger">
        {tips.map((tip, i) => (
          <div key={tip.id} className="card tip-card animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="tip-icon">{tip.icon}</div>
            <div className="tip-content">
              <div className="tip-title">{tip.title}</div>
              <div className="tip-desc">{tip.desc}</div>
              <div className="tip-points">{tip.points}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScoreInsights
