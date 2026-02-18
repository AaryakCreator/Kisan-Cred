import { useState, useEffect, useRef } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js'
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineUsers, HiOutlineChartBar, HiOutlineGlobe, HiOutlineClock } from 'react-icons/hi'
import { getDashboardStats } from '../services/api'
import './Dashboard.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend)

function AnimatedCounter({ target, duration = 1200, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return <span ref={ref}>{count}{suffix}</span>
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then((data) => {
      setStats(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Loading your agricultural data...</p>
        </div>
        <div className="grid-4 stagger-children">
          {[1,2,3,4].map(i => <div key={i} className="card skeleton-card"><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}
        </div>
      </div>
    )
  }

  const lineChartData = {
    labels: stats.registrationData.map(d => d.month),
    datasets: [{
      label: 'Registrations',
      data: stats.registrationData.map(d => d.count),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderWidth: 2.5,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#22c55e',
      pointBorderColor: '#0f1a12',
      pointBorderWidth: 2,
    }]
  }

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
      x: { grid: { color: 'rgba(74, 222, 128, 0.05)' }, ticks: { color: '#6a8a74', font: { family: 'Inter' } } },
      y: { grid: { color: 'rgba(74, 222, 128, 0.05)' }, ticks: { color: '#6a8a74', font: { family: 'Inter' } }, beginAtZero: true },
    }
  }

  const doughnutData = {
    labels: ['Excellent (90+)', 'Good (70-89)', 'Average (50-69)', 'Poor (30-49)', 'Critical (<30)'],
    datasets: [{
      data: [stats.scoreDistribution.excellent, stats.scoreDistribution.good, stats.scoreDistribution.average, stats.scoreDistribution.poor, stats.scoreDistribution.critical],
      backgroundColor: ['#22c55e', '#06b6d4', '#f59e0b', '#ef4444', '#7f1d1d'],
      borderColor: 'transparent',
      borderWidth: 0,
      hoverOffset: 6,
    }]
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9ab8a4', font: { family: 'Inter', size: 11 }, padding: 16, usePointStyle: true, pointStyleWidth: 8 }
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
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your agricultural data platform</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 stagger-children">
        <div className="card stat-card green animate-slide-up">
          <div className="stat-icon-wrap green"><HiOutlineUsers size={22} /></div>
          <div className="stat-label">Total Farmers</div>
          <div className="stat-value"><AnimatedCounter target={stats.totalFarmers} /></div>
          <div className="stat-change up"><HiOutlineTrendingUp size={14} /> +12% this month</div>
        </div>
        <div className="card stat-card amber animate-slide-up">
          <div className="stat-icon-wrap amber"><HiOutlineChartBar size={22} /></div>
          <div className="stat-label">Average Score</div>
          <div className="stat-value"><AnimatedCounter target={stats.avgScore} /></div>
          <div className="stat-change up"><HiOutlineTrendingUp size={14} /> +3 pts</div>
        </div>
        <div className="card stat-card cyan animate-slide-up">
          <div className="stat-icon-wrap cyan"><HiOutlineGlobe size={22} /></div>
          <div className="stat-label">Active Regions</div>
          <div className="stat-value"><AnimatedCounter target={stats.activeRegions} /></div>
          <div className="stat-change up"><HiOutlineTrendingUp size={14} /> +1 new</div>
        </div>
        <div className="card stat-card red animate-slide-up">
          <div className="stat-icon-wrap red"><HiOutlineClock size={22} /></div>
          <div className="stat-label">Pending Reviews</div>
          <div className="stat-value"><AnimatedCounter target={stats.pendingReviews} /></div>
          <div className="stat-change down"><HiOutlineTrendingDown size={14} /> needs attention</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginTop: 24 }}>
        <div className="card-static animate-slide-up">
          <h3 style={{ marginBottom: 16 }}>Farmer Registrations</h3>
          <div className="chart-container">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
        <div className="card-static animate-slide-up">
          <h3 style={{ marginBottom: 16 }}>Score Distribution</h3>
          <div className="chart-container">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-static" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Recent Activity</h3>
        <div className="activity-feed">
          {stats.recentActivity.map((item, i) => (
            <div key={item.id} className="activity-item animate-slide-right" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="activity-icon">{item.icon}</span>
              <div className="activity-content">
                <p className="activity-message">{item.message}</p>
                <span className="activity-time">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
