import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

/**
 * Footer.jsx
 * - Business name, address, phone number, opening hours.
 * - Links: Home, Menu, Track Order.
 * - Copyright line.
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        
        {/* About Section */}
        <div className="footer-section about">
          <Link to="/" className="footer-logo">
            <h2>Venki's<span>Foods</span></h2>
          </Link>
          <p className="footer-desc">
            Traditional Indian pickles and condiments handcrafted with love. Heritage recipes delivered to your doorstep.
          </p>
          <div className="social-links">
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Our Menu</Link></li>
            <li><Link to="/track">Track Order</Link></li>
            <li><Link to="/login">My Account</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <ul>
            <li><MapPin size={18} /> <span>Chennai, Tamil Nadu</span></li>
            <li><Phone size={18} /> <a href="https://wa.me/917200883609" target="_blank" rel="noopener noreferrer" style={{color:'inherit'}}><span>+91 72008 83609 (WhatsApp)</span></a></li>
            <li><Clock size={18} /> <span>Mon - Sat: 10:00 AM - 7:00 PM</span></li>
            <li><Clock size={18} /> <span style={{color:'var(--primary-gold)', fontWeight:600}}>Dispatch: 5 Working Days</span></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Venki's Foods. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .footer {
          margin-top: 5rem;
          padding-top: 5rem;
          background: rgba(10, 11, 13, 1);
          border-top: 1px solid var(--border-glass);
        }
        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr;
          gap: 4rem;
        }
        .footer-logo h2 {
          color: var(--primary-color);
          margin-bottom: 1.5rem;
        }
        .footer-logo span { color: #fff; font-weight: 300; }
        .footer-desc { color: var(--text-secondary); margin-bottom: 2rem; max-width: 300px; }
        .social-links { display: flex; gap: 1.5rem; color: #fff; }
        .social-links a:hover { color: var(--primary-color); }
        
        .footer-section h3 {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          color: #fff;
        }
        .footer-section ul { display: flex; flex-direction: column; gap: 1rem; }
        .footer-section ul li { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); }
        .footer-section ul li a:hover { color: var(--primary-color); }

        .footer-bottom {
          margin-top: 4rem;
          padding: 2rem 0;
          border-top: 1px solid var(--border-glass);
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .footer-content { grid-template-columns: 1fr; gap: 3rem; text-align: center; }
          .footer-section { display: flex; flex-direction: column; align-items: center; }
          .footer-desc { max-width: 100%; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
