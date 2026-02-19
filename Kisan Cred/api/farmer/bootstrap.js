import prisma from '../../lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Return the first registered farmer — used by the frontend
    // to auto-bootstrap when no farmer ID is set in localStorage.
    const farmer = await prisma.farmer.findFirst({
      select: { id: true, name: true },
      orderBy: { registeredAt: 'asc' },
    })

    if (!farmer) {
      return res.status(404).json({ error: 'No farmers found. Seed data via AgriScore first.' })
    }

    return res.status(200).json(farmer)
  } catch (err) {
    console.error('Bootstrap error:', err)
    return res.status(500).json({ error: 'Failed to fetch farmer' })
  }
}
