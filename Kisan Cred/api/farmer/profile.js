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
    const farmer = await prisma.farmer.findUnique({ where: { id } })
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' })
    }

    return res.status(200).json({
      id: farmer.id,
      name: farmer.name,
      location: farmer.location,
      state: farmer.location.split(', ').pop() || farmer.region,
      region: farmer.region,
      farmSize: farmer.farmSize,
      irrigationType: farmer.irrigationType || 'Unknown',
      soilType: farmer.soilType || 'Unknown',
      crops: farmer.crops,
      annualIncome: farmer.annualIncome || 0,
      score: farmer.score,
      status: farmer.status,
      phone: farmer.phone || 'Not provided',
      aadhaar: farmer.aadhaar || 'Not linked',
      registeredAt: farmer.registeredAt.toISOString().split('T')[0],
      lastActivity: farmer.lastActivity.toISOString().split('T')[0],
      documentsVerified: farmer.documentsVerified,
      documentsTotal: farmer.documentsTotal,
      avatar: farmer.name.split(' ').map(w => w[0]).join(''),
    })
  } catch (err) {
    console.error('GET /api/farmer/profile error:', err)
    return res.status(500).json({ error: 'Failed to fetch farmer profile' })
  }
}
