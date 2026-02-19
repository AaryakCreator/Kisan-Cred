import { useState, useEffect } from 'react'
import { HiOutlineSortDescending } from 'react-icons/hi'
import { getLoanSchemes, applyForLoan, getApplications } from '../services/api'
import { LOAN_TYPES } from '../services/mockData'
import './Loans.css'

function Loans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeType, setActiveType] = useState('all')
  const [sortBy, setSortBy] = useState('eligibility')
  const [applyingId, setApplyingId] = useState(null)
  const [appliedIds, setAppliedIds] = useState(new Set())
  const [toast, setToast] = useState(null)

  const loadData = () => {
    setLoading(true)
    setError(null)
    
    // Fetch loans and applications
    Promise.all([getLoanSchemes(), getApplications()])
      .then(([data, apps]) => {
        setLoans(data)
        setAppliedIds(new Set(apps.map(a => a.loanId)))
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load loan schemes. Please try again.')
        setLoading(false)
      })
  }

  useEffect(() => { loadData() }, [])

  const handleApply = async (loan) => {
    if (applyingId || appliedIds.has(loan.id)) return
    setApplyingId(loan.id)
    setToast(null)
    try {
      await applyForLoan({
        loanId: loan.id,
        loanName: loan.name,
        provider: loan.provider,
        amount: loan.maxAmount,
      })
      setAppliedIds(prev => new Set([...prev, loan.id]))
      setToast({ type: 'success', text: `Applied for ${loan.name} successfully!` })
    } catch (err) {
      setToast({ type: 'error', text: err.message })
    } finally {
      setApplyingId(null)
      setTimeout(() => setToast(null), 4000)
    }
  }

  // ... (rest of the file)

  const filteredLoans = loans
    .filter(l => activeType === 'all' || l.type === activeType)
    .sort((a, b) => {
      if (sortBy === 'eligibility') {
        const order = { eligible: 0, partial: 1, not_eligible: 2 }
        return (order[a.eligibility] || 0) - (order[b.eligibility] || 0)
      }
      if (sortBy === 'rate') return a.interestRate - b.interestRate
      if (sortBy === 'amount') return b.maxAmount - a.maxAmount
      return 0
    })

  const getEligibilityBadge = (e) => {
    const map = {
      eligible: { cls: 'badge-success', text: 'Eligible' },
      partial: { cls: 'badge-warning', text: 'Partial' },
      not_eligible: { cls: 'badge-danger', text: 'Not Eligible' },
    }
    const info = map[e] || map.not_eligible
    return <span className={`badge ${info.cls}`}>{info.text}</span>
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-header"><h1>Loan Schemes</h1></div>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ marginBottom: 8 }}>Unable to load loans</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>Retry</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page-header"><h1>Loan Schemes</h1></div>
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
        <h1>Loan Schemes</h1>
        <p>Personalized loan suggestions based on your credit score</p>
      </div>

      {/* Filter Chips */}
      <div className="loans-filter">
        <div className="chip-row">
          {LOAN_TYPES.map(t => (
            <button
              key={t.key}
              className={`chip ${activeType === t.key ? 'active' : ''}`}
              onClick={() => setActiveType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <HiOutlineSortDescending size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            className="input-field"
            style={{ padding: '6px 12px', fontSize: '0.75rem', minHeight: 32 }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="eligibility">Eligibility</option>
            <option value="rate">Interest Rate</option>
            <option value="amount">Max Amount</option>
          </select>
        </div>
      </div>

      {/* Loan Cards */}
      <div className="loans-list stagger">
        {filteredLoans.length === 0 ? (
          <div className="loans-empty">
            <div className="loans-empty-icon">🏦</div>
            <p>No loans found for this category</p>
          </div>
        ) : (
          filteredLoans.map((loan, i) => (
            <div key={loan.id} className="card loan-card animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="loan-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`loan-eligibility-dot ${loan.eligibility}`} />
                    <span className="loan-card-title">{loan.name}</span>
                  </div>
                  <div className="loan-card-provider">{loan.provider}</div>
                </div>
                {getEligibilityBadge(loan.eligibility)}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {loan.description}
              </p>

              <div className="loan-card-stats">
                <div className="loan-card-stat-item">
                  <span className="loan-card-stat-label">Interest</span>
                  <span className="loan-card-stat-value" style={{ color: 'var(--accent-primary)' }}>
                    {loan.interestRate === 0 ? 'Free' : `${loan.interestRate}%`}
                  </span>
                </div>
                <div className="loan-card-stat-item">
                  <span className="loan-card-stat-label">Max Amount</span>
                  <span className="loan-card-stat-value">
                    ₹{loan.maxAmount >= 100000 ? `${(loan.maxAmount / 100000).toFixed(1)}L` : loan.maxAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="loan-card-stat-item">
                  <span className="loan-card-stat-label">Tenure</span>
                  <span className="loan-card-stat-value">{loan.tenure}</span>
                </div>
                <div className="loan-card-stat-item">
                  <span className="loan-card-stat-label">Min Score</span>
                  <span className="loan-card-stat-value">{loan.minScore || '—'}</span>
                </div>
              </div>

              <div className="loan-features">
                {loan.features.map(f => (
                  <span key={f} className="loan-feature-tag">{f}</span>
                ))}
              </div>

              <div className="loan-card-footer">
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {loan.eligibility === 'eligible' ? '✓ You qualify' : loan.eligibility === 'partial' ? '⚠ Partial match' : '✗ Score too low'}
                </span>
                <button
                  className={`btn ${appliedIds.has(loan.id) ? 'btn-success' : loan.eligibility === 'eligible' ? 'btn-primary' : 'btn-secondary'} loan-apply-btn`}
                  disabled={loan.eligibility === 'not_eligible' || applyingId === loan.id || appliedIds.has(loan.id)}
                  onClick={() => handleApply(loan)}
                >
                  {appliedIds.has(loan.id)
                    ? '✓ Applied'
                    : applyingId === loan.id
                      ? 'Applying...'
                      : loan.eligibility === 'not_eligible'
                        ? 'Locked'
                        : 'Apply →'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`loan-toast ${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.text}
        </div>
      )}
    </div>
  )
}

export default Loans
