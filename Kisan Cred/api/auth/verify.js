export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone, aadhaar, otp } = req.body || {}

  // Mock verification logic
  // In a real app, this would check against a database or external service
  if (!phone || !aadhaar) {
    return res.status(400).json({ error: 'Phone and Aadhaar are required' })
  }

  // 1. Send OTP mode (otp not provided)
  if (!otp) {
    // Simulate sending OTP
    return res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully', 
      mockOtp: '1234' // For testing
    })
  }

  // 2. Verify OTP mode
  if (otp === '1234') {
    return res.status(200).json({ success: true, message: 'Verification successful' })
  } else {
    return res.status(400).json({ error: 'Invalid OTP' })
  }
}
