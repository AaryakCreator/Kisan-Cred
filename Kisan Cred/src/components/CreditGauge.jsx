import { useState, useEffect } from 'react'

function CreditGauge({ score = 0, size = 160, strokeWidth = 10 }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    let start = 0
    const step = Math.ceil(score / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [score])

  const getColor = (s) => {
    if (s >= 90) return '#22c55e'
    if (s >= 70) return '#06b6d4'
    if (s >= 50) return '#f59e0b'
    return '#ef4444'
  }

  const getLabel = (s) => {
    if (s >= 90) return 'Excellent'
    if (s >= 70) return 'Good'
    if (s >= 50) return 'Average'
    return 'Poor'
  }

  const color = getColor(animatedScore)
  const center = size / 2

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.3s ease' }}
        />
        {/* Glow effect */}
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          opacity="0.1"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'none',
      }}>
        <span style={{
          fontSize: size * 0.22,
          fontWeight: 800,
          color: color,
          lineHeight: 1,
        }}>
          {animatedScore}
        </span>
        <span style={{
          fontSize: size * 0.075,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: 600,
          marginTop: 4,
        }}>
          {getLabel(animatedScore)}
        </span>
      </div>
    </div>
  )
}

export default CreditGauge
