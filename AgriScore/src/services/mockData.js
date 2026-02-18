const FARMERS = [
  { id: 'f001', name: 'Rajesh Kumar', location: 'Punjab', region: 'North', farmSize: 12.5, crops: ['Wheat', 'Rice'], walletAddress: '0x1a2b...3c4d', status: 'active', score: 82, registeredAt: '2025-11-15', lastActivity: '2026-02-10' },
  { id: 'f002', name: 'Priya Sharma', location: 'Maharashtra', region: 'West', farmSize: 8.2, crops: ['Sugarcane', 'Cotton'], walletAddress: '0x5e6f...7g8h', status: 'active', score: 91, registeredAt: '2025-10-22', lastActivity: '2026-02-14' },
  { id: 'f003', name: 'Arun Patel', location: 'Gujarat', region: 'West', farmSize: 15.0, crops: ['Groundnut', 'Cotton', 'Wheat'], walletAddress: '0x9i0j...1k2l', status: 'active', score: 75, registeredAt: '2025-12-01', lastActivity: '2026-02-08' },
  { id: 'f004', name: 'Lakshmi Devi', location: 'Tamil Nadu', region: 'South', farmSize: 5.8, crops: ['Rice', 'Coconut'], walletAddress: '0x3m4n...5o6p', status: 'pending', score: 68, registeredAt: '2026-01-10', lastActivity: '2026-02-16' },
  { id: 'f005', name: 'Mohammed Ali', location: 'Karnataka', region: 'South', farmSize: 20.3, crops: ['Coffee', 'Pepper', 'Cardamom'], walletAddress: '0x7q8r...9s0t', status: 'active', score: 88, registeredAt: '2025-09-18', lastActivity: '2026-02-12' },
  { id: 'f006', name: 'Sunita Reddy', location: 'Telangana', region: 'South', farmSize: 10.0, crops: ['Rice', 'Turmeric'], walletAddress: '0xau1v...2w3x', status: 'active', score: 79, registeredAt: '2025-11-28', lastActivity: '2026-02-05' },
  { id: 'f007', name: 'Vikram Singh', location: 'Haryana', region: 'North', farmSize: 18.7, crops: ['Wheat', 'Mustard'], walletAddress: '0x4y5z...6a7b', status: 'suspended', score: 45, registeredAt: '2025-08-14', lastActivity: '2026-01-20' },
  { id: 'f008', name: 'Anita Kumari', location: 'Bihar', region: 'East', farmSize: 6.3, crops: ['Rice', 'Maize', 'Lentils'], walletAddress: '0x8c9d...0e1f', status: 'active', score: 73, registeredAt: '2025-12-20', lastActivity: '2026-02-15' },
  { id: 'f009', name: 'Suresh Yadav', location: 'Madhya Pradesh', region: 'Central', farmSize: 22.1, crops: ['Soybean', 'Wheat', 'Gram'], walletAddress: '0x2g3h...4i5j', status: 'active', score: 86, registeredAt: '2025-10-05', lastActivity: '2026-02-11' },
  { id: 'f010', name: 'Meena Bai', location: 'Rajasthan', region: 'West', farmSize: 14.6, crops: ['Bajra', 'Mustard'], walletAddress: '0x6k7l...8m9n', status: 'pending', score: 62, registeredAt: '2026-01-25', lastActivity: '2026-02-17' },
  { id: 'f011', name: 'Deepak Verma', location: 'Uttar Pradesh', region: 'North', farmSize: 9.4, crops: ['Sugarcane', 'Potato', 'Wheat'], walletAddress: '0x0o1p...2q3r', status: 'active', score: 77, registeredAt: '2025-11-02', lastActivity: '2026-02-09' },
  { id: 'f012', name: 'Kavita Nair', location: 'Kerala', region: 'South', farmSize: 4.2, crops: ['Rubber', 'Coconut', 'Banana'], walletAddress: '0x4s5t...6u7v', status: 'active', score: 93, registeredAt: '2025-09-30', lastActivity: '2026-02-13' },
  { id: 'f013', name: 'Ramesh Choudhary', location: 'West Bengal', region: 'East', farmSize: 7.8, crops: ['Rice', 'Jute', 'Tea'], walletAddress: '0x8w9x...0y1z', status: 'active', score: 81, registeredAt: '2025-10-18', lastActivity: '2026-02-07' },
  { id: 'f014', name: 'Fatima Begum', location: 'Assam', region: 'East', farmSize: 11.2, crops: ['Tea', 'Rice'], walletAddress: '0x2a3b...4c5d', status: 'active', score: 70, registeredAt: '2025-12-12', lastActivity: '2026-02-06' },
  { id: 'f015', name: 'Gopal Mishra', location: 'Odisha', region: 'East', farmSize: 16.9, crops: ['Rice', 'Cashew', 'Turmeric'], walletAddress: '0x6e7f...8g9h', status: 'active', score: 84, registeredAt: '2025-11-08', lastActivity: '2026-02-18' },
]

const REGISTRATION_DATA = [
  { month: 'Sep', count: 3 },
  { month: 'Oct', count: 5 },
  { month: 'Nov', count: 6 },
  { month: 'Dec', count: 4 },
  { month: 'Jan', count: 7 },
  { month: 'Feb', count: 8 },
]

const SCORE_DISTRIBUTION = {
  excellent: 3,   // 90+
  good: 5,        // 70-89
  average: 4,     // 50-69
  poor: 2,        // 30-49
  critical: 1,    // <30
}

const RECENT_ACTIVITY = [
  { id: 1, type: 'registration', message: 'Meena Bai registered from Rajasthan', time: '2 hours ago', icon: '🌱' },
  { id: 2, type: 'score_update', message: 'Priya Sharma score updated to 91', time: '5 hours ago', icon: '📊' },
  { id: 3, type: 'verification', message: 'Suresh Yadav data hash verified on-chain', time: '1 day ago', icon: '🔗' },
  { id: 4, type: 'registration', message: 'Lakshmi Devi applied for registration', time: '1 day ago', icon: '🌱' },
  { id: 5, type: 'score_update', message: 'Vikram Singh score dropped — review flagged', time: '2 days ago', icon: '⚠️' },
  { id: 6, type: 'verification', message: 'Kavita Nair wallet verified successfully', time: '3 days ago', icon: '✅' },
]

const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Northeast']

const CROP_OPTIONS = [
  'Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Groundnut', 'Soybean',
  'Coffee', 'Tea', 'Coconut', 'Rubber', 'Banana', 'Maize', 'Bajra',
  'Mustard', 'Potato', 'Lentils', 'Gram', 'Jute', 'Turmeric',
  'Pepper', 'Cardamom', 'Cashew',
]

const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'West Bengal',
]

export {
  FARMERS,
  REGISTRATION_DATA,
  SCORE_DISTRIBUTION,
  RECENT_ACTIVITY,
  REGIONS,
  CROP_OPTIONS,
  STATES,
}
