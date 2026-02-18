import { useState } from 'react'
import { HiOutlineUser, HiOutlineLocationMarker, HiOutlineClipboardCheck, HiOutlineCheckCircle, HiOutlineArrowRight, HiOutlineArrowLeft } from 'react-icons/hi'
import { createFarmer } from '../services/api'
import { CROP_OPTIONS, STATES } from '../services/mockData'
import './RegisterFarmer.css'

const STEPS = [
  { id: 1, title: 'Personal Info', icon: HiOutlineUser },
  { id: 2, title: 'Farm Details', icon: HiOutlineLocationMarker },
  { id: 3, title: 'Review & Submit', icon: HiOutlineClipboardCheck },
]

function RegisterFarmer() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    name: '', location: '', walletAddress: '',
    farmSize: '', crops: [], region: '',
  })

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const toggleCrop = (crop) => {
    setForm(prev => ({
      ...prev,
      crops: prev.crops.includes(crop) ? prev.crops.filter(c => c !== crop) : [...prev.crops, crop]
    }))
    setErrors(prev => ({ ...prev, crops: undefined }))
  }

  const validateStep = (s) => {
    const e = {}
    if (s === 1) {
      if (!form.name.trim()) e.name = 'Name is required'
      if (!form.location) e.location = 'Location is required'
      if (!form.walletAddress.trim()) e.walletAddress = 'Wallet address is required'
    }
    if (s === 2) {
      if (!form.farmSize || parseFloat(form.farmSize) <= 0) e.farmSize = 'Enter a valid farm size'
      if (form.crops.length === 0) e.crops = 'Select at least one crop'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 3))
  }
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const data = await createFarmer({
        name: form.name,
        location: form.location,
        walletAddress: form.walletAddress,
        farmSize: parseFloat(form.farmSize),
        crops: form.crops,
        region: form.region || 'North',
      })
      setResult(data)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSubmitted(false)
    setResult(null)
    setForm({ name: '', location: '', walletAddress: '', farmSize: '', crops: [], region: '' })
    setErrors({})
  }

  if (submitted) {
    return (
      <div className="page-container">
        <div className="success-container animate-scale">
          <div className="success-icon-lg"><HiOutlineCheckCircle size={64} /></div>
          <h2>Farmer Registered!</h2>
          <p>Registration submitted successfully for review.</p>
          {result && (
            <div className="success-details card-static">
              <div className="detail-row"><span>ID:</span><code>{result.id}</code></div>
              <div className="detail-row"><span>Name:</span><span>{result.name}</span></div>
              <div className="detail-row"><span>Status:</span><span className="badge badge-warning">{result.status}</span></div>
              <div className="detail-row"><span>Score:</span><span>{result.score}</span></div>
              {result.dataHash && <div className="detail-row"><span>Data Hash:</span><code className="hash-code">{result.dataHash}</code></div>}
            </div>
          )}
          <button className="btn btn-primary" onClick={resetForm} style={{ marginTop: 20 }}>Register Another</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Register Farmer</h1>
        <p>Add a new farmer to the AgriScore platform</p>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`step-item ${step >= s.id ? 'step-active' : ''} ${step > s.id ? 'step-done' : ''}`}>
            <div className="step-circle">
              {step > s.id ? <HiOutlineCheckCircle size={20} /> : <s.icon size={18} />}
            </div>
            <span className="step-label">{s.title}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="card-static register-card animate-fade">
        {step === 1 && (
          <div className="form-step animate-slide-right" key="step1">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" className={`input-field ${errors.name ? 'input-error' : ''}`} placeholder="Enter farmer's full name" value={form.name} onChange={e => update('name', e.target.value)} />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div className="input-group">
                <label htmlFor="location">State / Location</label>
                <select id="location" className={`input-field ${errors.location ? 'input-error' : ''}`} value={form.location} onChange={e => update('location', e.target.value)}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.location && <span className="error-text">{errors.location}</span>}
              </div>
              <div className="input-group full-width">
                <label htmlFor="wallet">Wallet Address</label>
                <input id="wallet" className={`input-field ${errors.walletAddress ? 'input-error' : ''}`} placeholder="0x..." value={form.walletAddress} onChange={e => update('walletAddress', e.target.value)} />
                {errors.walletAddress && <span className="error-text">{errors.walletAddress}</span>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step animate-slide-right" key="step2">
            <h3>Farm Details</h3>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="farmSize">Farm Size (acres)</label>
                <input id="farmSize" type="number" step="0.1" className={`input-field ${errors.farmSize ? 'input-error' : ''}`} placeholder="e.g. 12.5" value={form.farmSize} onChange={e => update('farmSize', e.target.value)} />
                {errors.farmSize && <span className="error-text">{errors.farmSize}</span>}
              </div>
              <div className="input-group">
                <label htmlFor="region">Region</label>
                <select id="region" className="input-field" value={form.region} onChange={e => update('region', e.target.value)}>
                  <option value="">Select region</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="Central">Central</option>
                  <option value="Northeast">Northeast</option>
                </select>
              </div>
            </div>
            <div className="input-group" style={{ marginTop: 16 }}>
              <label>Crop Types {errors.crops && <span className="error-text" style={{ marginLeft: 8 }}>{errors.crops}</span>}</label>
              <div className="crop-grid">
                {CROP_OPTIONS.map(crop => (
                  <button key={crop} type="button" className={`crop-chip ${form.crops.includes(crop) ? 'crop-selected' : ''}`} onClick={() => toggleCrop(crop)}>
                    {crop}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step animate-slide-right" key="step3">
            <h3>Review Details</h3>
            <div className="review-grid">
              <div className="review-item"><span className="review-label">Name</span><span className="review-value">{form.name}</span></div>
              <div className="review-item"><span className="review-label">Location</span><span className="review-value">{form.location}</span></div>
              <div className="review-item"><span className="review-label">Wallet</span><code className="review-value">{form.walletAddress}</code></div>
              <div className="review-item"><span className="review-label">Farm Size</span><span className="review-value">{form.farmSize} acres</span></div>
              <div className="review-item"><span className="review-label">Region</span><span className="review-value">{form.region || 'Not specified'}</span></div>
              <div className="review-item full-width"><span className="review-label">Crops</span><div className="review-crops">{form.crops.map(c => <span key={c} className="badge badge-success">{c}</span>)}</div></div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="form-nav">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={prevStep}><HiOutlineArrowLeft size={16} /> Back</button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button className="btn btn-primary" onClick={nextStep}>Next <HiOutlineArrowRight size={16} /></button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : '🌱 Submit Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterFarmer
