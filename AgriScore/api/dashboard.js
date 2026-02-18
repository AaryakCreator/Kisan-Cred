import prisma from '../lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const [totalFarmers, avgResult, regions, pendingReviews] = await Promise.all([
      prisma.farmer.count(),
      prisma.farmer.aggregate({ _avg: { score: true } }),
      prisma.farmer.findMany({ select: { region: true }, distinct: ['region'] }),
      prisma.farmer.count({ where: { status: 'pending' } }),
    ])

    const avgScore = Math.round(avgResult._avg.score || 0)
    const activeRegions = regions.length

    // Registration data — count farmers per month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const recentFarmers = await prisma.farmer.findMany({
      where: { registeredAt: { gte: sixMonthsAgo } },
      select: { registeredAt: true },
      orderBy: { registeredAt: 'asc' },
    })

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthCounts = {}
    recentFarmers.forEach((f) => {
      const m = monthNames[f.registeredAt.getMonth()]
      monthCounts[m] = (monthCounts[m] || 0) + 1
    })
    const registrationData = Object.entries(monthCounts).map(([month, count]) => ({ month, count }))

    // Score distribution
    const allScores = await prisma.farmer.findMany({ select: { score: true } })
    const scoreDistribution = { excellent: 0, good: 0, average: 0, poor: 0, critical: 0 }
    allScores.forEach(({ score }) => {
      if (score >= 90) scoreDistribution.excellent++
      else if (score >= 70) scoreDistribution.good++
      else if (score >= 50) scoreDistribution.average++
      else if (score >= 30) scoreDistribution.poor++
      else scoreDistribution.critical++
    })

    // Recent activity — last 6 farmers that changed
    const recent = await prisma.farmer.findMany({
      orderBy: { lastActivity: 'desc' },
      take: 6,
      select: { name: true, status: true, score: true, lastActivity: true, region: true },
    })
    const recentActivity = recent.map((f, i) => ({
      id: i + 1,
      type: f.status === 'pending' ? 'registration' : 'score_update',
      message: f.status === 'pending'
        ? `${f.name} applied for registration`
        : `${f.name} score updated to ${f.score}`,
      time: timeSince(f.lastActivity),
      icon: f.status === 'pending' ? '🌱' : '📊',
    }))

    return res.status(200).json({
      totalFarmers,
      avgScore,
      activeRegions,
      pendingReviews,
      registrationData,
      scoreDistribution,
      recentActivity,
    })
  } catch (err) {
    console.error('GET /api/dashboard error:', err)
    return res.status(500).json({ error: 'Failed to load dashboard stats' })
  }
}

function timeSince(date) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 3600) return `${Math.floor(s / 60)} minutes ago`
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`
  const d = Math.floor(s / 86400)
  return d === 1 ? '1 day ago' : `${d} days ago`
}
