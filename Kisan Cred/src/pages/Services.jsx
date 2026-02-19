import { HiOutlineCash, HiOutlineClipboardList, HiOutlineTrendingUp, HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineShoppingBag } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import './Services.css'

const services = [
  { id: 'loans', label: 'Apply for Loans', icon: HiOutlineCash, path: '/loans', color: 'green' },
  { id: 'check-score', label: 'Check Credit Score', icon: HiOutlineTrendingUp, path: '/score', color: 'amber' },
  { id: 'register', label: 'Farmer Registration', icon: HiOutlineClipboardList, path: '/profile', color: 'cyan' },
  { id: 'market', label: 'Market Linkage', icon: HiOutlineShoppingBag, path: '#', color: 'purple', comingSoon: true },
  { id: 'advisory', label: 'Crop Advisory', icon: HiOutlineUserGroup, path: '#', color: 'blue', comingSoon: true },
  { id: 'insurance', label: 'Insurance Plans', icon: HiOutlineShieldCheck, path: '#', color: 'rose', comingSoon: true },
]

function Services() {
  return (
    <div className="page pb-24">
      <div className="page-header animate-fade">
        <h1>All Services</h1>
        <p>Access financial and agricultural tools</p>
      </div>

      <div className="services-grid animate-slide-up">
        {services.map((service, index) => (
          <Link 
            to={service.path} 
            key={service.id} 
            className="service-card card card-interactive"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`service-icon ${service.color}`}>
              <service.icon size={24} />
            </div>
            <span className="service-label">{service.label}</span>
            {service.comingSoon && <span className="service-tag">Soon</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Services
