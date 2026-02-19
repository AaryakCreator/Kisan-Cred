import prisma from '../../lib/db.js'

// Static loan scheme catalog — reference data, not stored in DB
const LOAN_SCHEMES = [
  {
    id: 'loan001',
    name: 'Kisan Credit Card (KCC)',
    provider: 'State Bank of India',
    type: 'kcc',
    interestRate: 4.0,
    maxAmount: 300000,
    tenure: '5 years',
    minScore: 60,
    description: 'Short-term credit for crop production, post-harvest, and consumption needs.',
    features: ['Subsidized interest', 'Crop insurance coverage', 'Flexible repayment'],
  },
  {
    id: 'loan002',
    name: 'PM-KISAN Samman Nidhi',
    provider: 'Government of India',
    type: 'subsidy',
    interestRate: 0,
    maxAmount: 6000,
    tenure: 'Annual',
    minScore: 0,
    description: 'Direct income support of ₹6,000/year in 3 installments for all farmers.',
    features: ['No repayment', 'Direct bank transfer', 'Universal eligibility'],
  },
  {
    id: 'loan003',
    name: 'NABARD Term Loan',
    provider: 'NABARD',
    type: 'term',
    interestRate: 8.5,
    maxAmount: 1000000,
    tenure: '7 years',
    minScore: 65,
    description: 'Medium to long-term loan for farm mechanization, irrigation, and infrastructure.',
    features: ['Low interest for priority sector', 'Moratorium period', 'Flexible collateral'],
  },
  {
    id: 'loan004',
    name: 'SBI Crop Loan',
    provider: 'State Bank of India',
    type: 'crop',
    interestRate: 7.0,
    maxAmount: 500000,
    tenure: '12 months',
    minScore: 55,
    description: 'Short-term crop loan for purchase of seeds, fertilizers, and pesticides.',
    features: ['Quick disbursal', 'No processing fee', 'Interest subvention'],
  },
  {
    id: 'loan005',
    name: 'Micro Finance Loan',
    provider: 'Bandhan Bank',
    type: 'micro',
    interestRate: 12.5,
    maxAmount: 100000,
    tenure: '2 years',
    minScore: 40,
    description: 'Small ticket loans for allied agricultural activities and rural enterprise.',
    features: ['No collateral', 'Weekly/monthly repayment', 'Group lending available'],
  },
  {
    id: 'loan006',
    name: 'Dairy Entrepreneurship Loan',
    provider: 'NABARD',
    type: 'term',
    interestRate: 9.0,
    maxAmount: 750000,
    tenure: '5 years',
    minScore: 60,
    description: 'Loan for setting up modern dairy farms with subsidy from NABARD.',
    features: ['Govt. subsidy up to 33%', 'Back-ended subsidy', 'Training support'],
  },
  {
    id: 'loan007',
    name: 'Agriculture Gold Loan',
    provider: 'Muthoot Finance',
    type: 'micro',
    interestRate: 10.0,
    maxAmount: 200000,
    tenure: '1 year',
    minScore: 85,
    description: 'Quick loan against gold ornaments for immediate farming needs.',
    features: ['Instant disbursal', 'Minimal documentation', 'Flexible tenure'],
  },
]

function getEligibility(farmerScore, minScore) {
  if (farmerScore >= minScore) return 'eligible'
  if (farmerScore >= minScore - 15) return 'partial'
  return 'not_eligible'
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
    const farmer = await prisma.farmer.findUnique({
      where: { id },
      select: { score: true },
    })

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' })
    }

    const loans = LOAN_SCHEMES.map((loan) => ({
      ...loan,
      eligibility: getEligibility(farmer.score, loan.minScore),
    }))

    return res.status(200).json(loans)
  } catch (err) {
    console.error('GET /api/farmer/loans error:', err)
    return res.status(500).json({ error: 'Failed to fetch loan schemes' })
  }
}
