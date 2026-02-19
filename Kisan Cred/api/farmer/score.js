import prisma from '../../lib/db.js'

// Static score factors — computed from farmer data, not stored in DB
function computeScoreFactors(farmer) {
  const cropCount = farmer.crops.length
  const hasInsurance = false // Would come from a real insurance check
  const docPct = farmer.documentsTotal > 0
    ? Math.round((farmer.documentsVerified / farmer.documentsTotal) * 100)
    : 0

  return [
    {
      key: 'landOwnership',
      label: 'Land Ownership',
      value: farmer.farmSize >= 10 ? 85 : farmer.farmSize >= 5 ? 70 : 55,
      max: 100,
      weight: 20,
      tip: 'Upload latest land records to verify ownership',
      improvement: farmer.farmSize < 10 ? 10 : 0,
    },
    {
      key: 'cropDiversity',
      label: 'Crop Diversity',
      value: Math.min(100, cropCount * 25),
      max: 100,
      weight: 15,
      tip: cropCount < 4 ? 'Growing 4+ crop types can boost this by +8 points' : 'Great crop diversity!',
      improvement: cropCount < 4 ? 8 : 0,
    },
    {
      key: 'repaymentHistory',
      label: 'Repayment History',
      value: farmer.score >= 80 ? 90 : farmer.score >= 60 ? 75 : 50,
      max: 100,
      weight: 25,
      tip: farmer.score >= 80 ? 'Excellent! Maintain on-time payments' : 'Improve by making timely repayments',
      improvement: farmer.score < 80 ? 15 : 0,
    },
    {
      key: 'annualIncome',
      label: 'Annual Income',
      value: farmer.annualIncome >= 500000 ? 85 : farmer.annualIncome >= 300000 ? 65 : 45,
      max: 100,
      weight: 15,
      tip: 'Report income from allied activities (dairy, poultry)',
      improvement: farmer.annualIncome < 500000 ? 12 : 0,
    },
    {
      key: 'documentVerification',
      label: 'Document Verification',
      value: docPct,
      max: 100,
      weight: 15,
      tip: docPct < 100 ? 'Upload pending documents for score improvement' : 'All documents verified!',
      improvement: docPct < 100 ? 4 : 0,
    },
    {
      key: 'cropInsurance',
      label: 'Crop Insurance',
      value: hasInsurance ? 80 : 55,
      max: 100,
      weight: 10,
      tip: 'Enroll in PM Fasal Bima Yojana to gain +15 points',
      improvement: hasInsurance ? 0 : 15,
    },
  ]
}

// Generate a simplified score history using the current score
function generateScoreHistory(score) {
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
  const base = Math.max(30, score - 16)
  return months.map((month, i) => ({
    month,
    score: Math.min(100, base + Math.round((score - base) * ((i + 1) / months.length))),
  }))
}

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

    const factors = computeScoreFactors(farmer)
    const history = generateScoreHistory(farmer.score)

    return res.status(200).json({
      overall: farmer.score,
      factors,
      history,
    })
  } catch (err) {
    console.error('GET /api/farmer/score error:', err)
    return res.status(500).json({ error: 'Failed to fetch credit score' })
  }
}
