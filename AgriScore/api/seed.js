import prisma from '../lib/db.js'

const SEED_FARMERS = [
  { name: 'Rajesh Kumar', location: 'Ludhiana, Punjab', region: 'North', farmSize: 12.5, crops: ['Wheat', 'Rice', 'Sugarcane'], walletAddress: '0x1a2b3c4d', status: 'active', score: 82, registeredAt: new Date('2025-11-15'), lastActivity: new Date('2026-02-10'), irrigationType: 'Tube Well', soilType: 'Alluvial', annualIncome: 420000, phone: '+91 98765 43210', aadhaar: 'XXXX-XXXX-7842', documentsVerified: 4, documentsTotal: 5 },
  { name: 'Priya Sharma', location: 'Nashik, Maharashtra', region: 'West', farmSize: 8.2, crops: ['Sugarcane', 'Cotton'], walletAddress: '0x5e6f7a8b', status: 'active', score: 91, registeredAt: new Date('2025-10-22'), lastActivity: new Date('2026-02-14'), irrigationType: 'Canal', soilType: 'Black Cotton', annualIncome: 380000, phone: '+91 98765 43211', aadhaar: 'XXXX-XXXX-3156', documentsVerified: 5, documentsTotal: 5 },
  { name: 'Arun Patel', location: 'Ahmedabad, Gujarat', region: 'West', farmSize: 15.0, crops: ['Groundnut', 'Cotton', 'Wheat'], walletAddress: '0x9c0d1e2f', status: 'active', score: 75, registeredAt: new Date('2025-12-01'), lastActivity: new Date('2026-02-08'), irrigationType: 'Drip', soilType: 'Sandy Loam', annualIncome: 510000, phone: '+91 98765 43212', aadhaar: 'XXXX-XXXX-9021', documentsVerified: 3, documentsTotal: 5 },
  { name: 'Lakshmi Devi', location: 'Madurai, Tamil Nadu', region: 'South', farmSize: 5.8, crops: ['Rice', 'Coconut'], walletAddress: '0x3a4b5c6d', status: 'pending', score: 68, registeredAt: new Date('2026-01-10'), lastActivity: new Date('2026-02-16'), irrigationType: 'Rain-fed', soilType: 'Red Laterite', annualIncome: 280000, phone: '+91 98765 43213', aadhaar: 'XXXX-XXXX-4478', documentsVerified: 2, documentsTotal: 5 },
  { name: 'Mohammed Ali', location: 'Mysuru, Karnataka', region: 'South', farmSize: 20.3, crops: ['Coffee', 'Pepper', 'Cardamom'], walletAddress: '0x7e8f9a0b', status: 'active', score: 88, registeredAt: new Date('2025-09-18'), lastActivity: new Date('2026-02-12'), irrigationType: 'Sprinkler', soilType: 'Laterite', annualIncome: 620000, phone: '+91 98765 43214', aadhaar: 'XXXX-XXXX-6693', documentsVerified: 5, documentsTotal: 5 },
  { name: 'Sunita Reddy', location: 'Warangal, Telangana', region: 'South', farmSize: 10.0, crops: ['Rice', 'Turmeric'], walletAddress: '0x1c2d3e4f', status: 'active', score: 79, registeredAt: new Date('2025-11-28'), lastActivity: new Date('2026-02-05'), irrigationType: 'Canal', soilType: 'Black Cotton', annualIncome: 350000, phone: '+91 98765 43215', aadhaar: 'XXXX-XXXX-8815', documentsVerified: 4, documentsTotal: 5 },
  { name: 'Vikram Singh', location: 'Karnal, Haryana', region: 'North', farmSize: 18.7, crops: ['Wheat', 'Mustard'], walletAddress: '0x5a6b7c8d', status: 'suspended', score: 45, registeredAt: new Date('2025-08-14'), lastActivity: new Date('2026-01-20'), irrigationType: 'Tube Well', soilType: 'Alluvial', annualIncome: 290000, phone: '+91 98765 43216', aadhaar: 'XXXX-XXXX-2237', documentsVerified: 1, documentsTotal: 5 },
  { name: 'Anita Kumari', location: 'Patna, Bihar', region: 'East', farmSize: 6.3, crops: ['Rice', 'Maize', 'Lentils'], walletAddress: '0x9e0f1a2b', status: 'active', score: 73, registeredAt: new Date('2025-12-20'), lastActivity: new Date('2026-02-15'), irrigationType: 'Rain-fed', soilType: 'Alluvial', annualIncome: 240000, phone: '+91 98765 43217', aadhaar: 'XXXX-XXXX-5549', documentsVerified: 3, documentsTotal: 5 },
  { name: 'Suresh Yadav', location: 'Bhopal, Madhya Pradesh', region: 'Central', farmSize: 22.1, crops: ['Soybean', 'Wheat', 'Gram'], walletAddress: '0x3c4d5e6f', status: 'active', score: 86, registeredAt: new Date('2025-10-05'), lastActivity: new Date('2026-02-11'), irrigationType: 'Drip', soilType: 'Black Cotton', annualIncome: 560000, phone: '+91 98765 43218', aadhaar: 'XXXX-XXXX-7761', documentsVerified: 5, documentsTotal: 5 },
  { name: 'Meena Bai', location: 'Jodhpur, Rajasthan', region: 'West', farmSize: 14.6, crops: ['Bajra', 'Mustard'], walletAddress: '0x7a8b9c0d', status: 'pending', score: 62, registeredAt: new Date('2026-01-25'), lastActivity: new Date('2026-02-17'), irrigationType: 'Rain-fed', soilType: 'Sandy', annualIncome: 180000, phone: '+91 98765 43219', aadhaar: 'XXXX-XXXX-1183', documentsVerified: 2, documentsTotal: 5 },
  { name: 'Deepak Verma', location: 'Lucknow, Uttar Pradesh', region: 'North', farmSize: 9.4, crops: ['Sugarcane', 'Potato', 'Wheat'], walletAddress: '0x1e2f3a4b', status: 'active', score: 77, registeredAt: new Date('2025-11-02'), lastActivity: new Date('2026-02-09'), irrigationType: 'Canal', soilType: 'Alluvial', annualIncome: 310000, phone: '+91 98765 43220', aadhaar: 'XXXX-XXXX-9395', documentsVerified: 4, documentsTotal: 5 },
  { name: 'Kavita Nair', location: 'Kochi, Kerala', region: 'South', farmSize: 4.2, crops: ['Rubber', 'Coconut', 'Banana'], walletAddress: '0x5c6d7e8f', status: 'active', score: 93, registeredAt: new Date('2025-09-30'), lastActivity: new Date('2026-02-13'), irrigationType: 'Sprinkler', soilType: 'Laterite', annualIncome: 480000, phone: '+91 98765 43221', aadhaar: 'XXXX-XXXX-6627', documentsVerified: 5, documentsTotal: 5 },
  { name: 'Ramesh Choudhary', location: 'Kolkata, West Bengal', region: 'East', farmSize: 7.8, crops: ['Rice', 'Jute', 'Tea'], walletAddress: '0x9a0b1c2d', status: 'active', score: 81, registeredAt: new Date('2025-10-18'), lastActivity: new Date('2026-02-07'), irrigationType: 'Canal', soilType: 'Alluvial', annualIncome: 340000, phone: '+91 98765 43222', aadhaar: 'XXXX-XXXX-3849', documentsVerified: 4, documentsTotal: 5 },
  { name: 'Fatima Begum', location: 'Guwahati, Assam', region: 'East', farmSize: 11.2, crops: ['Tea', 'Rice'], walletAddress: '0x3e4f5a6b', status: 'active', score: 70, registeredAt: new Date('2025-12-12'), lastActivity: new Date('2026-02-06'), irrigationType: 'Rain-fed', soilType: 'Red Laterite', annualIncome: 260000, phone: '+91 98765 43223', aadhaar: 'XXXX-XXXX-5071', documentsVerified: 3, documentsTotal: 5 },
  { name: 'Gopal Mishra', location: 'Bhubaneswar, Odisha', region: 'East', farmSize: 16.9, crops: ['Rice', 'Cashew', 'Turmeric'], walletAddress: '0x7c8d9e0f', status: 'active', score: 84, registeredAt: new Date('2025-11-08'), lastActivity: new Date('2026-02-18'), irrigationType: 'Drip', soilType: 'Red Laterite', annualIncome: 440000, phone: '+91 98765 43224', aadhaar: 'XXXX-XXXX-8203', documentsVerified: 4, documentsTotal: 5 },
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
