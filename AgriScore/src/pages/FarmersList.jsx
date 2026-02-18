import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineSearch, HiOutlineFilter, HiOutlineSortDescending } from 'react-icons/hi'
import { getFarmers } from '../services/api'
import './FarmersList.css'

function FarmersList() {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const navigate = useNavigate()

  useEffect(() => {
    getFarmers().then((data) => {
      setFarmers(data)
      setLoading(false)
    })
  }, [])

  const filtered = farmers
    .filter(f => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || f.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'farmSize') return b.farmSize - a.farmSize
      if (sortBy === 'recent') return new Date(b.registeredAt) - new Date(a.registeredAt)
      return 0
    })

  const getStatusBadge = (status) => {
    const map = { active: 'badge-success', pending: 'badge-warning', suspended: 'badge-danger' }
    return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>
  }

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e'
    if (score >= 70) return '#06b6d4'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1>Farmers</h1>
          <p>{farmers.length} registered farmers</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/register')}>
          + Register New
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar card-static">
        <div className="filter-search">
          <HiOutlineSearch size={16} className="filter-icon" />
          <input className="input-field" placeholder="Search by name or location..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-actions">
          <div className="filter-group">
            <HiOutlineFilter size={14} />
            <select className="input-field filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="filter-group">
            <HiOutlineSortDescending size={14} />
            <select className="input-field filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="score">Score</option>
              <option value="farmSize">Farm Size</option>
              <option value="recent">Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-static" style={{ padding: 0, marginTop: 16, overflow: 'hidden' }}>
        {loading ? (
          <div className="table-loading">Loading farmers...</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty">No farmers match your search</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Farmer</th>
                <th>Location</th>
                <th>Farm Size</th>
                <th>Score</th>
                <th>Status</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((farmer, i) => (
                <tr key={farmer.id} onClick={() => navigate(`/farmers/${farmer.id}`)} className="animate-fade" style={{ animationDelay: `${i * 40}ms` }}>
                  <td>
                    <div className="farmer-cell">
                      <div className="farmer-avatar" style={{ background: `linear-gradient(135deg, ${getScoreColor(farmer.score)}33, ${getScoreColor(farmer.score)}11)`, color: getScoreColor(farmer.score) }}>
                        {farmer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="farmer-name">{farmer.name}</div>
                        <div className="farmer-crops">{farmer.crops.slice(0, 2).join(', ')}</div>
                      </div>
                    </div>
                  </td>
                  <td>{farmer.location}</td>
                  <td>{farmer.farmSize} acres</td>
                  <td>
                    <div className="score-bar-cell">
                      <span style={{ color: getScoreColor(farmer.score), fontWeight: 700 }}>{farmer.score}</span>
                      <div className="score-bar-mini">
                        <div className="score-bar-fill" style={{ width: `${farmer.score}%`, background: getScoreColor(farmer.score) }} />
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(farmer.status)}</td>
                  <td>{new Date(farmer.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default FarmersList
