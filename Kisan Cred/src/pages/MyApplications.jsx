import { useState, useEffect } from 'react'
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineRefresh } from 'react-icons/hi'
import { getApplications } from '../services/api'
import './MyApplications.css'

const STATUS_MAP = {
  submitted:    { label: 'Submitted',    cls: 'badge-info',    icon: <HiOutlineDocumentText size={14} /> },
  under_review: { label: 'Under Review', cls: 'badge-warning', icon: <HiOutlineClock size={14} /> },
  approved:     { label: 'Approved',     cls: 'badge-success', icon: <HiOutlineCheckCircle size={14} /> },
  rejected:     { label: 'Rejected',     cls: 'badge-danger',  icon: <HiOutlineXCircle size={14} /> },
}

function MyApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = () => {
    setLoading(true)
    setError(null)
    getApplications()
      .then(data => { setApps(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }

  useEffect(() => { loadData() }, [])

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const formatAmount = (a) => a >= 100000 ? `₹${(a / 100000).toFixed(1)}L` : `₹${a.toLocaleString('en-IN')}`

  if (error) {
    return (
      <div className="page">
        <div className="page-header"><h1>My Applications</h1></div>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ marginBottom: 8 }}>Unable to load</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>Retry</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page-header"><h1>My Applications</h1></div>
        <div className="flex-col gap-12">
          {[1,2,3].map(i => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div className="skeleton skeleton-line medium" />
              <div className="skeleton skeleton-line short" style={{ marginTop: 8 }} />
              <div className="skeleton skeleton-line" style={{ marginTop: 12, height: 20 }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>{apps.length} loan application{apps.length !== 1 ? 's' : ''}</p>
      </div>

      {apps.length === 0 ? (
        <div className="apps-empty">
          <div className="apps-empty-icon">📋</div>
          <p>No applications yet</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Apply for loans from the Loans page to track them here
          </p>
        </div>
      ) : (
        <div className="apps-list stagger">
          {apps.map((app, i) => {
            const status = STATUS_MAP[app.status] || STATUS_MAP.submitted
            return (
              <div key={app.id} className="card app-card animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="app-card-header">
                  <div>
                    <div className="app-card-name">{app.loanName}</div>
                    <div className="app-card-provider">{app.provider}</div>
                  </div>
                  <span className={`badge ${status.cls}`}>
                    {status.icon} {status.label}
                  </span>
                </div>

                <div className="app-card-details">
                  <div className="app-card-detail">
                    <span className="app-card-detail-label">Amount</span>
                    <span className="app-card-detail-value">{formatAmount(app.amount)}</span>
                  </div>
                  <div className="app-card-detail">
                    <span className="app-card-detail-label">Applied</span>
                    <span className="app-card-detail-value">{formatDate(app.appliedAt)}</span>
                  </div>
                </div>

                {/* Status timeline */}
                <div className="app-timeline">
                  <div className={`app-timeline-step ${['submitted','under_review','approved','rejected'].indexOf(app.status) >= 0 ? 'done' : ''}`}>
                    <div className="app-timeline-dot" />
                    <span>Submitted</span>
                  </div>
                  <div className="app-timeline-line" />
                  <div className={`app-timeline-step ${['under_review','approved'].indexOf(app.status) >= 0 ? 'done' : ''}`}>
                    <div className="app-timeline-dot" />
                    <span>Review</span>
                  </div>
                  <div className="app-timeline-line" />
                  <div className={`app-timeline-step ${app.status === 'approved' ? 'done' : app.status === 'rejected' ? 'rejected' : ''}`}>
                    <div className="app-timeline-dot" />
                    <span>{app.status === 'rejected' ? 'Rejected' : 'Approved'}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button className="btn btn-secondary app-refresh-btn" onClick={loadData}>
        <HiOutlineRefresh size={14} /> Refresh
      </button>
    </div>
  )
}

export default MyApplications
