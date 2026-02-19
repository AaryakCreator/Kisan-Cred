const API_BASE = '/api/farmer'

// --- Farmer ID management ---
// Resolved lazily on first API call; cached in localStorage after bootstrap.
let _farmerId = typeof window !== 'undefined'
  ? localStorage.getItem('kisan_farmer_id') || ''
  : ''

let _bootstrapPromise = null

async function ensureFarmerId() {
  if (_farmerId) return _farmerId

  // Only bootstrap once, even if called concurrently
  if (!_bootstrapPromise) {
    _bootstrapPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/bootstrap`)
        if (!res.ok) throw new Error('bootstrap failed')
        const data = await res.json()
        _farmerId = data.id
        localStorage.setItem('kisan_farmer_id', _farmerId)
        return _farmerId
      } catch (err) {
        console.error('Auto-bootstrap failed:', err)
        throw new Error('No farmer ID available. Please seed data via AgriScore first.')
      }
    })()
  }
  return _bootstrapPromise
}

async function apiFetch(path) {
  const id = await ensureFarmerId()
  const res = await fetch(`${API_BASE}${path}?id=${id}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'API request failed')
  }
  return res.json()
}

export async function getFarmerProfile() {
  return apiFetch('/profile')
}

export async function getCreditScore() {
  return apiFetch('/score')
}

export async function getLoanSchemes(type = 'all') {
  const loans = await apiFetch('/loans')
  if (type === 'all') return loans
  return loans.filter(l => l.type === type)
}

export async function getQuickStats() {
  return apiFetch('/stats')
}

export async function applyForLoan({ loanId, loanName, provider, amount }) {
  const id = await ensureFarmerId()
  const res = await fetch(`${API_BASE}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ farmerId: id, loanId, loanName, provider, amount }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Application failed')
  return data
}

export async function getApplications() {
  return apiFetch('/apply')
}

export async function verifyUser({ phone, aadhaar, otp }) {
  const res = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, aadhaar, otp }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Verification failed')
  return data
}

export async function onboardFarmer(details) {
  const res = await fetch(`${API_BASE}/onboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Onboarding failed')
  // Automatically login the user
  localStorage.setItem('kisan_farmer_id', data.farmerId)
  return data
}

export async function updateProfile({ phone, aadhaar }) {
  const id = await ensureFarmerId()
  const res = await fetch(`${API_BASE}/update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, phone, aadhaar }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Update failed')
  return data
}

export async function getActivity() {
  try {
    const apps = await getApplications()
    if (apps.length > 0) {
      const statusColors = { submitted: '#06b6d4', under_review: '#f59e0b', approved: '#22c55e', rejected: '#ef4444' }
      return apps.slice(0, 6).map((a, i) => ({
        id: a.id || i + 1,
        text: `${a.loanName} — ${a.status.replace('_', ' ')}`,
        time: new Date(a.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        color: statusColors[a.status] || '#06b6d4',
      }))
    }
  } catch (_) {}
  // Fallback static activity if no applications
  return [
    { id: 1, text: 'Credit score updated', time: 'Recently', color: '#22c55e' },
    { id: 2, text: 'Profile verified', time: 'Recently', color: '#06b6d4' },
  ]
}

export async function getImprovementTips() {
  return [
    { id: 1, icon: '🌾', title: 'Add Crop Insurance', desc: 'Enroll in PM Fasal Bima Yojana for crop protection and score improvement.', points: '+15 pts' },
    { id: 2, icon: '📄', title: 'Complete Documents', desc: 'Upload your pending Kisan Card to complete verification.', points: '+4 pts' },
    { id: 3, icon: '🌱', title: 'Diversify Crops', desc: 'Add one more crop type to demonstrate farming diversification.', points: '+8 pts' },
    { id: 4, icon: '💰', title: 'Report Allied Income', desc: 'Add dairy or poultry income data to improve income score.', points: '+12 pts' },
  ]
}
