import { HiOutlinePhone, HiOutlineMail, HiOutlineChatAlt2 } from 'react-icons/hi'

function Help() {
  return (
    <div className="page pb-24">
      <div className="page-header animate-fade">
        <h1>Help Center</h1>
        <p>We are here to assist you 24/7</p>
      </div>

      <div className="card animate-slide-up">
        <h3>Contact Support</h3>
        <div className="info-list mt-16">
          <div className="activity-item">
            <div className="activity-dot" style={{ background: 'var(--accent-primary)' }} />
            <div style={{ flex: 1 }}>
              <div className="activity-text" style={{ fontWeight: 600 }}>Kisan Helpline</div>
              <div className="activity-time">1800-111-222 (Toll Free)</div>
            </div>
            <button className="btn btn-ghost btn-icon" style={{ color: 'var(--accent-primary)' }}>
              <HiOutlinePhone size={20} />
            </button>
          </div>
          <div className="activity-item">
            <div className="activity-dot" style={{ background: 'var(--accent-secondary)' }} />
            <div style={{ flex: 1 }}>
              <div className="activity-text" style={{ fontWeight: 600 }}>Email Support</div>
              <div className="activity-time">support@kisancred.com</div>
            </div>
            <button className="btn btn-ghost btn-icon" style={{ color: 'var(--accent-secondary)' }}>
              <HiOutlineMail size={20} />
            </button>
          </div>
          <div className="activity-item">
            <div className="activity-dot" style={{ background: 'var(--accent-tertiary)' }} />
            <div style={{ flex: 1 }}>
              <div className="activity-text" style={{ fontWeight: 600 }}>WhatsApp Assistant</div>
              <div className="activity-time">+91 98765 43210</div>
            </div>
            <button className="btn btn-ghost btn-icon" style={{ color: 'var(--accent-tertiary)' }}>
              <HiOutlineChatAlt2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="card mt-16 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h3>FAQs</h3>
        <p className="text-secondary mt-16" style={{ fontSize: '0.9rem' }}>
          <strong>How do I improve my credit score?</strong><br/>
          Regularly update your crop data and repay loans on time.
        </p>
        <div style={{ height: 1, background: 'var(--border-color)', margin: '12px 0' }} />
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
          <strong>Is my data safe?</strong><br/>
          Yes, your data is encrypted and stored securely.
        </p>
      </div>
    </div>
  )
}

export default Help
