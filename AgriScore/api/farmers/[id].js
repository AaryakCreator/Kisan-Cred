import prisma from '../../lib/db.js'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const farmer = await prisma.farmer.findUnique({ where: { id } })

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' })
    }

    return res.status(200).json({
      id: farmer.id,
      name: farmer.name,
      location: farmer.location,
      region: farmer.region,
      farmSize: farmer.farmSize,
      crops: farmer.crops,
      walletAddress: farmer.walletAddress,
      status: farmer.status,
      score: farmer.score,
      dataHash: farmer.dataHash,
      registeredAt: farmer.registeredAt.toISOString().split('T')[0],
      lastActivity: farmer.lastActivity.toISOString().split('T')[0],
    })
  } catch (err) {
    console.error(`GET /api/farmers/${id} error:`, err)
    return res.status(500).json({ error: 'Failed to fetch farmer' })
  }
}
