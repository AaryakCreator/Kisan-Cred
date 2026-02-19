// --- Default Farmer Profile ---
export const FARMER = {
  id: 'f001',
  name: 'Rajesh Kumar',
  location: 'Ludhiana, Punjab',
  state: 'Punjab',
  region: 'North',
  farmSize: 12.5,
  irrigationType: 'Tube Well',
  soilType: 'Alluvial',
  crops: ['Wheat', 'Rice', 'Sugarcane'],
  annualIncome: 420000,
  score: 78,
  status: 'active',
  phone: '+91 98XXX XXXXX',
  aadhaar: 'XXXX-XXXX-7842',
  registeredAt: '2025-11-15',
  lastActivity: '2026-02-18',
  documentsVerified: 4,
  documentsTotal: 5,
  avatar: 'RK',
}

// --- Credit Score Factors ---
export const SCORE_FACTORS = [
  { key: 'landOwnership', label: 'Land Ownership', value: 85, max: 100, weight: 20, tip: 'Upload latest land records to verify ownership', improvement: 5 },
  { key: 'cropDiversity', label: 'Crop Diversity', value: 72, max: 100, weight: 15, tip: 'Growing 4+ crop types can boost this by +8 points', improvement: 8 },
  { key: 'repaymentHistory', label: 'Repayment History', value: 90, max: 100, weight: 25, tip: 'Excellent! Maintain on-time payments', improvement: 0 },
  { key: 'annualIncome', label: 'Annual Income', value: 65, max: 100, weight: 15, tip: 'Report income from allied activities (dairy, poultry)', improvement: 12 },
  { key: 'documentVerification', label: 'Document Verification', value: 80, max: 100, weight: 15, tip: 'Upload pending Kisan card for +4 points', improvement: 4 },
  { key: 'cropInsurance', label: 'Crop Insurance', value: 55, max: 100, weight: 10, tip: 'Enroll in PM Fasal Bima Yojana to gain +15 points', improvement: 15 },
]

// --- Loan Schemes ---
export const LOAN_SCHEMES = [
  {
    id: 'loan001',
    name: 'Kisan Credit Card (KCC)',
    provider: 'State Bank of India',
    type: 'kcc',
    interestRate: 4.0,
    maxAmount: 300000,
    tenure: '5 years',
    eligibility: 'eligible',
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
    eligibility: 'eligible',
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
    eligibility: 'eligible',
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
    eligibility: 'eligible',
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
    eligibility: 'partial',
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
    eligibility: 'partial',
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
    eligibility: 'not_eligible',
    minScore: 85,
    description: 'Quick loan against gold ornaments for immediate farming needs.',
    features: ['Instant disbursal', 'Minimal documentation', 'Flexible tenure'],
  },
]

// --- Loan Type Labels ---
export const LOAN_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'kcc', label: 'KCC' },
  { key: 'crop', label: 'Crop Loan' },
  { key: 'term', label: 'Term Loan' },
  { key: 'micro', label: 'Micro Finance' },
  { key: 'subsidy', label: 'Subsidy' },
]

// --- Score History (for mini chart) ---
export const SCORE_HISTORY = [
  { month: 'Sep', score: 62 },
  { month: 'Oct', score: 65 },
  { month: 'Nov', score: 68 },
  { month: 'Dec', score: 71 },
  { month: 'Jan', score: 74 },
  { month: 'Feb', score: 78 },
]

// --- Dashboard Quick Stats ---
export const QUICK_STATS = {
  loanEligibility: 85,
  activeLoans: 2,
  nextEMI: '₹4,200',
  nextEMIDate: 'Mar 5',
  totalDisbursed: '₹3.2L',
}

// --- Activity Timeline ---
export const ACTIVITY = [
  { id: 1, text: 'Credit score updated to 78', time: '2 hours ago', color: '#22c55e' },
  { id: 2, text: 'KCC loan application approved', time: '1 day ago', color: '#06b6d4' },
  { id: 3, text: 'Land document verified successfully', time: '3 days ago', color: '#22c55e' },
  { id: 4, text: 'Crop insurance enrollment pending', time: '5 days ago', color: '#f59e0b' },
  { id: 5, text: 'Annual income data submitted', time: '1 week ago', color: '#a855f7' },
  { id: 6, text: 'PM-KISAN installment received ₹2,000', time: '2 weeks ago', color: '#22c55e' },
]

// --- Improvement Tips ---
export const IMPROVEMENT_TIPS = [
  { id: 1, icon: '🌾', title: 'Add Crop Insurance', desc: 'Enroll in PM Fasal Bima Yojana for crop protection and score improvement.', points: '+15 pts' },
  { id: 2, icon: '📄', title: 'Complete Documents', desc: 'Upload your pending Kisan Card to complete verification.', points: '+4 pts' },
  { id: 3, icon: '🌱', title: 'Diversify Crops', desc: 'Add one more crop type to demonstrate farming diversification.', points: '+8 pts' },
  { id: 4, icon: '💰', title: 'Report Allied Income', desc: 'Add dairy or poultry income data to improve income score.', points: '+12 pts' },
]
