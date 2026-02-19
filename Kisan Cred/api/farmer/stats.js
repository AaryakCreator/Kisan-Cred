import prisma from '../../lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (!id) {
    return res.status(400).json({ error: 'Farmer id is required (?id=...)' })
  }

  try {
    const farmer = await prisma.farmer.findUnique({
      where: { id },
      select: { score: true, status: true, lastActivity: true },
    })

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' })
    }

    // Compute quick stats from the farmer's data
    const loanEligibility = Math.min(100, Math.round((farmer.score / 100) * 115))
    const activeLoans = farmer.score >= 70 ? 2 : farmer.score >= 50 ? 1 : 0
    const totalDisbursed = activeLoans >= 2 ? '₹3.2L' : activeLoans === 1 ? '₹1.5L' : '₹0'

    return res.status(200).json({
      loanEligibility,
      activeLoans,
      nextEMI: activeLoans > 0 ? '₹4,200' : '—',
      nextEMIDate: activeLoans > 0 ? 'Mar 5' : '—',
      totalDisbursed,
    })
  } catch (err) {
    console.error('GET /api/farmer/stats error:', err)
    return res.status(500).json({ error: 'Failed to fetch stats' })
  }
}
