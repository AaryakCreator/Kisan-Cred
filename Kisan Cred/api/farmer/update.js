import prisma from '../../lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id, phone, aadhaar } = req.body || {}

  if (!id) {
    return res.status(400).json({ error: 'Farmer id is required' })
  }

  // Only allow updating phone and aadhaar
  const data = {}
  if (phone !== undefined) data.phone = phone
  if (aadhaar !== undefined) data.aadhaar = aadhaar

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Nothing to update. Provide phone or aadhaar.' })
  }

  try {
    const farmer = await prisma.farmer.update({
      where: { id },
      data,
      select: { id: true, phone: true, aadhaar: true },
    })

    return res.status(200).json({ message: 'Profile updated', farmer })
  } catch (err) {
    console.error('Update error:', err)
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Farmer not found' })
    }
    return res.status(500).json({ error: 'Failed to update profile' })
  }
}
