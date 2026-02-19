import { useState, useEffect } from 'react'
import { HiOutlineLocationMarker, HiOutlineCube, HiOutlineShieldCheck, HiOutlineClock, HiOutlinePencil, HiOutlineCheck, HiOutlineX } from 'react-icons/hi'
import { getFarmerProfile, getActivity, updateProfile } from '../services/api'
import './Profile.css'

function Profile() {
  const [farmer, setFarmer] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Edit State
  const [editing, setEditing] = useState(null) // 'phone' or 'aadhaar'
  const [editValue, setEditValue] = useState('')
  const [updating, setUpdating] = useState(false)

  const loadData = () => {
    setLoading(true)
    setError(null)
    Promise.all([getFarmerProfile(), getActivity()])
      .then(([f, a]) => {
        setFarmer(f)
        setActivity(a)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => { loadData() }, [])

  const startEdit = (field, value) => {
    setEditing(field)
    setEditValue(value)
  }

  const cancelEdit = () => {
    setEditing(null)
    setEditValue('')
  }

  const saveEdit = async () => {
    if (!editValue) return
    setUpdating(true)
    try {
      const update = { [editing]: editValue }
      await updateProfile(update)
      setFarmer(prev => ({ ...prev, ...update }))
      setEditing(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (error) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ marginBottom: 8 }}>Unable to load profile</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>Retry</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div className="skeleton skeleton-circle" style={{ width: 64, height: 64 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-line medium" />
              <div className="skeleton skeleton-line short" style={{ marginTop: 8 }} />
            </div>
          </div>
        </div>
        <div className="card" style={{ marginTop: 12, padding: 18 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-line" style={{ marginBottom: 10 }} />)}
        </div>
      </div>
    )
  }

  const docPct = Math.round((farmer.documentsVerified / farmer.documentsTotal) * 100)

  const renderEditableRow = (label, field, value) => (
    <div className="info-row">
      <span className="info-row-label">{label}</span>
      {editing === field ? (
        <div style={{ flex: 1, display: 'flex', gap: 8 }}>
          <input 
            className="input-field" 
            value={editValue} 
            onChange={e => setEditValue(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '0.9rem' }}
            autoFocus
          />
          <button className="btn btn-icon btn-success sm" onClick={saveEdit} disabled={updating}>
            <HiOutlineCheck />
          </button>
          <button className="btn btn-icon btn-danger sm" onClick={cancelEdit} disabled={updating}>
            <HiOutlineX />
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="info-row-value">{value || '—'}</span>
          <button className="btn-icon-text" onClick={() => startEdit(field, value)}>
            <HiOutlinePencil size={14} />
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Your farmer data and verification status</p>
      </div>

      {/* Profile Header */}
      <div className="card profile-header animate-scale">
        <div className="profile-avatar">{farmer.avatar || farmer.name.charAt(0)}</div>
        <div className="profile-info">
          <div className="profile-name">{farmer.name}</div>
          <div className="profile-location">
            <HiOutlineLocationMarker size={13} /> {farmer.location}
          </div>
          <div className="profile-badges">
            <span className="badge badge-success">{farmer.status}</span>
            <span className="badge badge-info">Score: {farmer.score}</span>
          </div>
        </div>
      </div>

      {/* Farm Details */}
      <div className="card profile-section mt-16 animate-slide-up">
        <h3><HiOutlineCube size={16} /> Farm Details</h3>
        <div className="info-list">
          <div className="info-row">
            <span className="info-row-label">Farm Size</span>
            <span className="info-row-value">{farmer.farmSize} acres</span>
          </div>
          <div className="info-row">
            <span className="info-row-label">Region</span>
            <span className="info-row-value">{farmer.region}</span>
          </div>
          <div className="info-row">
            <span className="info-row-label">Irrigation</span>
            <span className="info-row-value">{farmer.irrigationType || '—'}</span>
          </div>
          <div className="info-row">
            <span className="info-row-label">Soil Type</span>
            <span className="info-row-value">{farmer.soilType || '—'}</span>
          </div>
          <div className="info-row">
            <span className="info-row-label">Crops</span>
            <div className="crops-list">
              {farmer.crops && farmer.crops.map(c => <span key={c} className="badge badge-success">{c}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Verification & Contact */}
      <div className="card profile-section mt-16 animate-slide-up">
        <h3><HiOutlineShieldCheck size={16} /> Verification</h3>
        <div className="info-list">
          {renderEditableRow('Aadhaar', 'aadhaar', farmer.aadhaar)}
          {renderEditableRow('Phone', 'phone', farmer.phone)}
          
          <div className="info-row" style={{ marginTop: 12 }}>
            <span className="info-row-label">Documents</span>
            <div className="doc-status">
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{farmer.documentsVerified}/{farmer.documentsTotal}</span>
              <div className="doc-progress-bar">
                <div className="doc-progress-fill" style={{ width: `${docPct}%` }} />
              </div>
            </div>
          </div>
          <div className="info-row">
            <span className="info-row-label">Registered</span>
            <span className="info-row-value">
              {new Date(farmer.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card profile-section mt-16 animate-slide-up">
        <h3><HiOutlineClock size={16} /> Activity</h3>
        {activity.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '10px 0' }}>No recent activity</p>
        ) : (
          activity.map((a, i) => (
            <div key={a.id} className="activity-item" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="activity-dot" style={{ background: a.color }} />
              <div>
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Profile

