import prisma from '../../lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, location, phone, aadhaar, farmSize, region, crops, soilType, irrigationType } = req.body || {}

  if (!name || !phone || !aadhaar) {
    return res.status(400).json({ error: 'Name, Phone and Aadhaar are required' })
  }

  try {
    // Check if farmer already exists with this phone number
    const existingFarmer = await prisma.farmer.findFirst({
      where: { phone },
    })

    if (existingFarmer) {
      return res.status(200).json({
        message: 'Welcome back!',
        farmerId: existingFarmer.id,
        name: existingFarmer.name,
        isExisting: true
      })
    }

    const farmer = await prisma.farmer.create({
      data: {
        name,
        location: location || 'Unknown',
        phone,
        aadhaar,
        farmSize: parseFloat(farmSize) || 0,
        region: region || 'North',
        crops: crops || [],
        soilType,
        irrigationType,
        status: 'active', // Auto-active for demo
        score: 75, // Default starting score
        documentsVerified: 2, // Assume Aadhaar/Phone verified
        documentsTotal: 5,
        registeredAt: new Date(),
      },
    })

    return res.status(201).json({ 
      message: 'Onboarding successful', 
      farmerId: farmer.id,
      name: farmer.name 
    })
  } catch (err) {
    console.error('Onboard error:', err)
    return res.status(500).json({ error: 'Failed to create farmer profile' })
  }
}
