import prisma from '../lib/db.js'

const SEED_FARMERS = [
  { name: 'Rajesh Kumar', location: 'Punjab', region: 'North', farmSize: 12.5, crops: ['Wheat', 'Rice'], walletAddress: '0x1a2b3c4d', status: 'active', score: 82, registeredAt: new Date('2025-11-15'), lastActivity: new Date('2026-02-10') },
  { name: 'Priya Sharma', location: 'Maharashtra', region: 'West', farmSize: 8.2, crops: ['Sugarcane', 'Cotton'], walletAddress: '0x5e6f7g8h', status: 'active', score: 91, registeredAt: new Date('2025-10-22'), lastActivity: new Date('2026-02-14') },
  { name: 'Arun Patel', location: 'Gujarat', region: 'West', farmSize: 15.0, crops: ['Groundnut', 'Cotton', 'Wheat'], walletAddress: '0x9i0j1k2l', status: 'active', score: 75, registeredAt: new Date('2025-12-01'), lastActivity: new Date('2026-02-08') },
  { name: 'Lakshmi Devi', location: 'Tamil Nadu', region: 'South', farmSize: 5.8, crops: ['Rice', 'Coconut'], walletAddress: '0x3m4n5o6p', status: 'pending', score: 68, registeredAt: new Date('2026-01-10'), lastActivity: new Date('2026-02-16') },
  { name: 'Mohammed Ali', location: 'Karnataka', region: 'South', farmSize: 20.3, crops: ['Coffee', 'Pepper', 'Cardamom'], walletAddress: '0x7q8r9s0t', status: 'active', score: 88, registeredAt: new Date('2025-09-18'), lastActivity: new Date('2026-02-12') },
  { name: 'Sunita Reddy', location: 'Telangana', region: 'South', farmSize: 10.0, crops: ['Rice', 'Turmeric'], walletAddress: '0xau1v2w3x', status: 'active', score: 79, registeredAt: new Date('2025-11-28'), lastActivity: new Date('2026-02-05') },
  { name: 'Vikram Singh', location: 'Haryana', region: 'North', farmSize: 18.7, crops: ['Wheat', 'Mustard'], walletAddress: '0x4y5z6a7b', status: 'suspended', score: 45, registeredAt: new Date('2025-08-14'), lastActivity: new Date('2026-01-20') },
  { name: 'Anita Kumari', location: 'Bihar', region: 'East', farmSize: 6.3, crops: ['Rice', 'Maize', 'Lentils'], walletAddress: '0x8c9d0e1f', status: 'active', score: 73, registeredAt: new Date('2025-12-20'), lastActivity: new Date('2026-02-15') },
  { name: 'Suresh Yadav', location: 'Madhya Pradesh', region: 'Central', farmSize: 22.1, crops: ['Soybean', 'Wheat', 'Gram'], walletAddress: '0x2g3h4i5j', status: 'active', score: 86, registeredAt: new Date('2025-10-05'), lastActivity: new Date('2026-02-11') },
  { name: 'Meena Bai', location: 'Rajasthan', region: 'West', farmSize: 14.6, crops: ['Bajra', 'Mustard'], walletAddress: '0x6k7l8m9n', status: 'pending', score: 62, registeredAt: new Date('2026-01-25'), lastActivity: new Date('2026-02-17') },
  { name: 'Deepak Verma', location: 'Uttar Pradesh', region: 'North', farmSize: 9.4, crops: ['Sugarcane', 'Potato', 'Wheat'], walletAddress: '0x0o1p2q3r', status: 'active', score: 77, registeredAt: new Date('2025-11-02'), lastActivity: new Date('2026-02-09') },
  { name: 'Kavita Nair', location: 'Kerala', region: 'South', farmSize: 4.2, crops: ['Rubber', 'Coconut', 'Banana'], walletAddress: '0x4s5t6u7v', status: 'active', score: 93, registeredAt: new Date('2025-09-30'), lastActivity: new Date('2026-02-13') },
  { name: 'Ramesh Choudhary', location: 'West Bengal', region: 'East', farmSize: 7.8, crops: ['Rice', 'Jute', 'Tea'], walletAddress: '0x8w9x0y1z', status: 'active', score: 81, registeredAt: new Date('2025-10-18'), lastActivity: new Date('2026-02-07') },
  { name: 'Fatima Begum', location: 'Assam', region: 'East', farmSize: 11.2, crops: ['Tea', 'Rice'], walletAddress: '0x2a3b4c5d', status: 'active', score: 70, registeredAt: new Date('2025-12-12'), lastActivity: new Date('2026-02-06') },
  { name: 'Gopal Mishra', location: 'Odisha', region: 'East', farmSize: 16.9, crops: ['Rice', 'Cashew', 'Turmeric'], walletAddress: '0x6e7f8g9h', status: 'active', score: 84, registeredAt: new Date('2025-11-08'), lastActivity: new Date('2026-02-18') },
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    // Clear existing data first
    await prisma.farmer.deleteMany({})

    // Seed with mock data
    const result = await prisma.farmer.createMany({ data: SEED_FARMERS })

    return res.status(200).json({
      message: `Successfully seeded ${result.count} farmers`,
      count: result.count,
    })
  } catch (err) {
    console.error('POST /api/seed error:', err)
    return res.status(500).json({ error: 'Seed failed: ' + err.message })
  }
}
