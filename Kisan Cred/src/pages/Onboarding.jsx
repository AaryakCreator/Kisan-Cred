import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineUser, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineCheckCircle, HiOutlineArrowRight, HiOutlineCube } from 'react-icons/hi'
import { verifyUser, onboardFarmer } from '../services/api'
import './Onboarding.css'

const STEPS = [
  { id: 1, label: 'Personal Details', icon: HiOutlineUser },
  { id: 2, label: 'Verification', icon: HiOutlinePhone },
  { id: 3, label: 'Farm Details', icon: HiOutlineCube },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhaar: '',
    location: '',
    otp: '',
    farmSize: '',
    region: 'North',
    crops: [],
    soilType: 'Alluvial',
    irrigationType: 'Canal',
  })

  // OTP State
  const [otpSent, setOtpSent] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCropChange = (crop) => {
    setFormData(prev => {
      const crops = prev.crops.includes(crop)
        ? prev.crops.filter(c => c !== crop)
        : [...prev.crops, crop]
      return { ...prev, crops }
    })
  }

  const sendOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) return setError('Invalid phone number')
    setLoading(true)
    setError(null)
    try {
      await verifyUser({ phone: formData.phone, aadhaar: formData.aadhaar })
      setOtpSent(true)
      // Auto-fill OTP for demo convenience
      setTimeout(() => setFormData(prev => ({ ...prev, otp: '1234' })), 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (!formData.otp) return setError('Enter OTP')
    setLoading(true)
    setError(null)
    try {
      await verifyUser({ phone: formData.phone, aadhaar: formData.aadhaar, otp: formData.otp })
      setVerified(true)
      setTimeout(() => setStep(3), 500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await onboardFarmer(formData)
      navigate('/profile') // Redirect to profile on success
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const nextStep = () => {
    setError(null)
    if (step === 1) {
      if (!formData.name || !formData.location || !formData.phone || !formData.aadhaar) {
        return setError('Please fill all fields')
      }
      setStep(2)
    } else if (step === 2) {
      if (!verified) return setError('Please verify your phone number')
      setStep(3)
    }
  }

  const renderStep1 = () => (
    <div className="onboard-step animate-slide-up">
      <h3>Personal Details</h3>
      <div className="form-group">
        <label>Full Name</label>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Vikram Singh" />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Village, District, State" />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" type="tel" maxLength="10" />
      </div>
      <div className="form-group">
        <label>Aadhaar Number</label>
        <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} placeholder="XXXX XXXX XXXX" maxLength="12" />
      </div>
      <button className="btn btn-primary btn-block mt-20" onClick={nextStep}>
        Next <HiOutlineArrowRight />
      </button>
    </div>
  )

  const renderStep2 = () => (
    <div className="onboard-step animate-slide-up">
      <h3>Verification</h3>
      <p className="text-muted text-sm mb-20">We sent an OTP to {formData.phone}</p>
      
      {!otpSent ? (
        <button className="btn btn-primary btn-block" onClick={sendOtp} disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      ) : (
        <>
          <div className="form-group">
            <label>Enter OTP</label>
            <input 
              name="otp" 
              value={formData.otp} 
              onChange={handleChange} 
              placeholder="1234" 
              className="otp-input"
              maxLength="4"
              style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.2rem' }}
            />
          </div>
          <button 
            className={`btn btn-block ${verified ? 'btn-success' : 'btn-primary'}`} 
            onClick={verifyOtp} 
            disabled={loading || verified}
          >
            {loading ? 'Verifying...' : verified ? 'Verified ✓' : 'Verify OTP'}
          </button>
          {!verified && (
            <div className="text-center mt-10">
              <span className="link-text text-sm" onClick={sendOtp}>Resend OTP</span>
            </div>
          )}
        </>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="onboard-step animate-slide-up">
      <h3>Farm Details</h3>
      <div className="form-group">
        <label>Farm Size (Acres)</label>
        <input name="farmSize" value={formData.farmSize} onChange={handleChange} type="number" placeholder="5.5" />
      </div>
      <div className="form-group">
        <label>Region</label>
        <select name="region" value={formData.region} onChange={handleChange}>
          <option value="North">North (Punjab, Haryana)</option>
          <option value="South">South (Karnataka, Tamil Nadu)</option>
          <option value="East">East (West Bengal, Bihar)</option>
          <option value="West">West (Gujarat, Maharashtra)</option>
          <option value="Central">Central (MP, UP)</option>
        </select>
      </div>
      <div className="form-group">
        <label>Crops Grown</label>
        <div className="chip-container">
          {['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize', 'Pulses'].map(crop => (
            <button
              key={crop}
              className={`chip ${formData.crops.includes(crop) ? 'active' : ''}`}
              onClick={() => handleCropChange(crop)}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label>Irrigation Type</label>
        <select name="irrigationType" value={formData.irrigationType} onChange={handleChange}>
          <option value="Tube Well">Tube Well</option>
          <option value="Canal">Canal</option>
          <option value="Rainfed">Rainfed</option>
          <option value="Drip">Drip Irrigation</option>
        </select>
      </div>
      <button className="btn btn-primary btn-block mt-20" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating Profile...' : 'Complete Registration'}
      </button>
    </div>
  )

  return (
    <div className="page onboarding-page">
      <div className="onboard-header">
        <h1>Kisan Cred</h1>
        <p>Join the future of farming finance</p>
      </div>

      {/* Progress Steps */}
      <div className="steps-container">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`step-item ${step >= s.id ? 'active' : ''}`}>
            <div className="step-circle">
              {step > s.id ? <HiOutlineCheckCircle /> : s.id}
            </div>
            <span className="step-label">{s.label}</span>
            {i < STEPS.length - 1 && <div className={`step-line ${step > s.id ? 'full' : ''}`} />}
          </div>
        ))}
      </div>

      <div className="card onboard-card">
        {error && <div className="alert alert-error mb-16">{error}</div>}
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  )
}
