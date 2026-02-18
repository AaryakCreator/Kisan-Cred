import { useState, useEffect } from 'react'
import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { HiOutlineAdjustments, HiOutlineUsers } from 'react-icons/hi'
import { getFarmers, getScoreBreakdown } from '../services/api'
import './Scoring.css'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

function Scoring() {
  const [farmers, setFarmers] = useState([])
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const [scores, setScores] = useState(null)
  const [loading, setLoading] = useState(true)
  const [simValues, setSimValues] = useState({ landSize: 50, cropDiversity: 50, history: 50, location: 50, verification: 50 })

  useEffect(() => {
    getFarmers().then((data) => {
      setFarmers(data)
      if (data.length > 0) {
        setSelectedFarmer(data[0])
        getScoreBreakdown(data[0].id).then(s => {
          setScores(s)
          if (s) setSimValues(s.factors)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
  }, [])

  const handleFarmerChange = async (farmerId) => {
    const farmer = farmers.find(f => f.id === farmerId)
    setSelectedFarmer(farmer)
    const s = await getScoreBreakdown(farmerId)
    setScores(s)
    if (s) setSimValues(s.factors)
  }

  const handleSimChange = (key, value) => {
    setSimValues(prev => ({ ...prev, [key]: parseInt(value) }))
  }

  const simulatedScore = Math.round(
    Object.values(simValues).reduce((sum, v) => sum + v, 0) / Object.values(simValues).length
  )

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e'
    if (score >= 70) return '#06b6d4'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
  }

  const radarData = {
    labels: ['Land Size', 'Crop Diversity', 'History', 'Location', 'Verification'],
    datasets: [
      ...(scores ? [{
        label: 'Actual Score',
        data: Object.values(scores.factors),
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderColor: '#22c55e',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#22c55e',
      }] : []),
      {
        label: 'Simulated',
        data: Object.values(simValues),
        backgroundColor: 'rgba(6, 182, 212, 0.12)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 4,
        pointBackgroundColor: '#06b6d4',
      }
    ]
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9ab8a4', font: { family: 'Inter', size: 11 }, padding: 16, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 26, 18, 0.9)',
        titleColor: '#e8f0ea',
        bodyColor: '#9ab8a4',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(74, 222, 128, 0.08)' },
        grid: { color: 'rgba(74, 222, 128, 0.08)' },
        pointLabels: { color: '#9ab8a4', font: { family: 'Inter', size: 11, weight: 500 } },
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 100,
      }
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header"><h1>Scoring</h1><p>Loading scoring data...</p></div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Credit Scoring</h1>
        <p>Analyze and simulate farmer credit scores</p>
      </div>

      {/* Farmer Selector */}
      <div className="scoring-selector card-static">
        <div className="flex-gap">
          <HiOutlineUsers size={18} />
          <select className="input-field" value={selectedFarmer?.id || ''} onChange={e => handleFarmerChange(e.target.value)}>
            {farmers.map(f => <option key={f.id} value={f.id}>{f.name} — {f.location}</option>)}
          </select>
        </div>
        {selectedFarmer && (
          <div className="selector-score">
            <span className="selector-score-label">Current Score</span>
            <span className="selector-score-value" style={{ color: getScoreColor(selectedFarmer.score) }}>{selectedFarmer.score}</span>
          </div>
        )}
      </div>

      <div className="scoring-layout">
        {/* Radar Chart */}
        <div className="card-static scoring-chart animate-scale">
          <h3 style={{ marginBottom: 16 }}>Score Radar</h3>
          <div style={{ height: 340 }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Simulator */}
        <div className="card-static scoring-sim animate-slide-right">
          <div className="sim-header">
            <h3><HiOutlineAdjustments size={18} /> What-If Simulator</h3>
            <div className="sim-result">
              <span className="sim-label">Simulated Score</span>
              <span className="sim-value" style={{ color: getScoreColor(simulatedScore) }}>{simulatedScore}</span>
            </div>
          </div>

          <div className="sim-sliders">
            {Object.entries(simValues).map(([key, value]) => (
              <div key={key} className="slider-group">
                <div className="slider-header">
                  <span className="slider-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                  <span className="slider-value" style={{ color: getScoreColor(value) }}>{value}</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={value}
                  onChange={e => handleSimChange(key, e.target.value)}
                  className="score-slider"
                  style={{ '--fill-pct': `${value}%`, '--fill-color': getScoreColor(value) }}
                />
              </div>
            ))}
          </div>

          {scores && (
            <div className="sim-comparison">
              <div className="sim-compare-item">
                <span>Actual</span>
                <span style={{ color: getScoreColor(scores.overall), fontWeight: 700 }}>{scores.overall}</span>
              </div>
              <div className="sim-compare-arrow">→</div>
              <div className="sim-compare-item">
                <span>Simulated</span>
                <span style={{ color: getScoreColor(simulatedScore), fontWeight: 700 }}>{simulatedScore}</span>
              </div>
              <div className="sim-compare-diff" style={{ color: simulatedScore >= scores.overall ? '#22c55e' : '#ef4444' }}>
                {simulatedScore >= scores.overall ? '+' : ''}{simulatedScore - scores.overall} pts
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Scoring
