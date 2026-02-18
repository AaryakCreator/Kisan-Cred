import { FARMERS, REGISTRATION_DATA, SCORE_DISTRIBUTION, RECENT_ACTIVITY } from './mockData'

// On Vercel, API routes are same-origin at /api
// Locally without backend, falls back to mock data
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn('API unavailable, using mock data:', err.message)
    return null
  }
}

export async function getFarmers() {
  const data = await apiFetch('/farmers')
  if (data) return data
  await delay(300)
  return [...FARMERS]
}

export async function getFarmer(id) {
  const data = await apiFetch(`/farmers/${id}`)
  if (data) return data
  await delay(200)
  return FARMERS.find((f) => f.id === id) || null
}

export async function createFarmer(farmerData) {
  const data = await apiFetch('/farmers', {
    method: 'POST',
    body: JSON.stringify(farmerData),
  })
  if (data) return data
  await delay(500)
  const newFarmer = {
    id: `f${String(FARMERS.length + 1).padStart(3, '0')}`,
    ...farmerData,
    status: 'pending',
    score: Math.floor(Math.random() * 30) + 50,
    registeredAt: new Date().toISOString().split('T')[0],
    lastActivity: new Date().toISOString().split('T')[0],
    dataHash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
  }
  FARMERS.push(newFarmer)
  return newFarmer
}

export async function getDashboardStats() {
  const data = await apiFetch('/dashboard')
  if (data) return data

  // Fallback to mock data
  await delay(250)
  const totalFarmers = FARMERS.length
  const avgScore = Math.round(FARMERS.reduce((sum, f) => sum + f.score, 0) / totalFarmers)
  const activeRegions = new Set(FARMERS.map((f) => f.region)).size
  const pendingReviews = FARMERS.filter((f) => f.status === 'pending').length

  return {
    totalFarmers,
    avgScore,
    activeRegions,
    pendingReviews,
    registrationData: REGISTRATION_DATA,
    scoreDistribution: SCORE_DISTRIBUTION,
    recentActivity: RECENT_ACTIVITY,
  }
}

export async function getScoreBreakdown(farmerId) {
  await delay(200)
  const farmer = FARMERS.find((f) => f.id === farmerId)
  if (!farmer) return null
  return {
    overall: farmer.score,
    factors: {
      landSize: Math.min(100, Math.round(farmer.farmSize * 4.5)),
      cropDiversity: Math.min(100, farmer.crops.length * 30),
      history: Math.floor(Math.random() * 30) + 60,
      location: Math.floor(Math.random() * 25) + 65,
      verification: farmer.walletAddress ? 85 : 40,
    },
  }
}
