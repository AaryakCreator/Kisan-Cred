import { calculateCreditScore } from '../services/scoring.js'

import prisma from '../lib/db.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const farmers = await prisma.farmer.findMany({
        orderBy: { registeredAt: 'desc' },
      })

      // Map fields to match the frontend's camelCase expectations
      const mapped = farmers.map((f) => ({
        id: f.id,
        name: f.name,
        location: f.location,
        region: f.region,
        farmSize: f.farmSize,
        crops: f.crops,
        walletAddress: f.walletAddress,
        status: f.status,
        score: f.score,
        dataHash: f.dataHash,
        registeredAt: f.registeredAt.toISOString().split('T')[0],
        lastActivity: f.lastActivity.toISOString().split('T')[0],
      }))

      return res.status(200).json(mapped)
    } catch (err) {
      console.error('GET /api/farmers error:', err)
      return res.status(500).json({ error: 'Failed to fetch farmers' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, location, region, farmSize, crops, walletAddress, revenueHistory } = req.body

      if (!name || !location) {
        return res.status(400).json({ error: 'Name and location are required' })
      }

      // Calculate score using the engine
      // We pass the partial farmer object (id not yet created, but not needed for basic calculation or we can mock it)
      const farmerData = { 
        name, location, region, farmSize: parseFloat(farmSize) || 0, id: name + location // minimal mock ID for hash
      }
      
      const { score, details } = await calculateCreditScore(farmerData, revenueHistory || [])
      
      const dataHash =
        '0x' +
        Array.from({ length: 16 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')

      const farmer = await prisma.farmer.create({
        data: {
          name,
          location,
          region: region || 'North',
          farmSize: parseFloat(farmSize) || 0,
          crops: crops || [],
          walletAddress: walletAddress || null,
          status: 'pending',
          score,
          dataHash,
          // Store component scores if schema supported it, for now we just store total score
          // or we could add them to metadata/JSON field if Prisma had one. 
          // For MVP, total score is enough.
          
          revenueHistory: {
            create: (revenueHistory || []).map(r => ({
              year: r.year,
              season: r.season,
              crop: r.crop,
              amount: r.amount
            }))
          }
        },
      })

      return res.status(201).json({
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
      console.error('POST /api/farmers error:', err)
      return res.status(500).json({ error: 'Failed to create farmer' })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
