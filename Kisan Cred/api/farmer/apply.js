import prisma from '../../lib/db.js'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { farmerId, loanId, loanName, provider, amount } = req.body || {}

    if (!farmerId || !loanId || !loanName) {
      return res.status(400).json({ error: 'farmerId, loanId, and loanName are required' })
    }

    try {
      // Check if farmer exists
      const farmer = await prisma.farmer.findUnique({ where: { id: farmerId } })
      if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' })
      }

      // Check for duplicate application
      const existing = await prisma.loanApplication.findFirst({
        where: { farmerId, loanId, status: { in: ['submitted', 'under_review', 'approved'] } },
      })
      if (existing) {
        return res.status(409).json({
          error: 'You have already applied for this loan',
          application: {
            id: existing.id,
            status: existing.status,
            appliedAt: existing.appliedAt,
          },
        })
      }

      // Create application
      const application = await prisma.loanApplication.create({
        data: {
          farmerId,
          loanId,
          loanName,
          provider: provider || 'Government',
          amount: amount || 0,
          status: 'submitted',
        },
      })

      return res.status(201).json({
        message: 'Application submitted successfully!',
        application: {
          id: application.id,
          loanName: application.loanName,
          status: application.status,
          appliedAt: application.appliedAt,
        },
      })
    } catch (err) {
      console.error('Apply error:', err)
      return res.status(500).json({ error: 'Failed to submit application' })
    }
  }

  // GET — list farmer's applications
  if (req.method === 'GET') {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: 'id query parameter is required' })
    }

    try {
      const applications = await prisma.loanApplication.findMany({
        where: { farmerId: id },
        orderBy: { appliedAt: 'desc' },
      })

      return res.status(200).json(
        applications.map((a) => ({
          id: a.id,
          loanId: a.loanId,
          loanName: a.loanName,
          provider: a.provider,
          amount: a.amount,
          status: a.status,
          appliedAt: a.appliedAt,
        }))
      )
    } catch (err) {
      console.error('Applications list error:', err)
      return res.status(500).json({ error: 'Failed to fetch applications' })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
