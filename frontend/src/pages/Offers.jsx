import React from 'react';
import { Tag, Bell, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

const Offers = () => {
  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <SEOHead 
        title="Exclusive Offers | Venki's Foods" 
        description="Stay tuned for our upcoming heritage sales and exclusive pickle combos." 
      />

      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Decorative glow spots */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: '200px', height: '200px',
            background: 'var(--primary-gold)',
            filter: 'blur(80px)', opacity: 0.06,
            transform: 'translate(-50%, -50%)', borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '250px', height: '250px',
            background: 'var(--primary-gold)',
            filter: 'blur(80px)', opacity: 0.06,
            transform: 'translate(50%, 50%)', borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          {/* Main Content */}
          <div style={{
            position: 'relative', zIndex: 1,
            padding: 'clamp(2.5rem, 8vw, 5rem) clamp(1.5rem, 6vw, 4rem)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center'
          }}>

            {/* Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'var(--gold-gradient)', padding: '1px',
                borderRadius: '50px', marginBottom: '1.5rem'
              }}
            >
              <div style={{ background: '#050505', padding: '0.35rem 1.2rem', borderRadius: '50px' }}>
                <span style={{
                  background: 'var(--gold-gradient)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  fontWeight: 800, fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase'
                }}>Stay Tuned</span>
              </div>
            </motion.div>

            {/* Heading — clamp keeps it from exploding on mobile */}
            <h1 style={{ 
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 8vw, 5rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              maxWidth: '700px',
              wordBreak: 'break-word'
            }}>
              Exclusive{' '}
              <span style={{
                background: 'var(--gold-gradient)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Heritage</span>
              <br />
              Offers are{' '}
              <span style={{
                background: 'var(--gold-gradient)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Brewing</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
              maxWidth: '520px',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
              fontWeight: 300,
              padding: '0 0.5rem'
            }}>
              We are handcrafting special deals on our secret family recipes. 
              Our next big heritage sale will be announced shortly.
            </p>

            {/* CTA — single line, no wrap */}
            <Link 
              to="/menu" 
              className="btn btn-primary" 
              style={{ 
                borderRadius: '50px',
                marginBottom: '3rem',
                whiteSpace: 'nowrap',
                padding: '0.9rem 2.5rem',
                fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)'
              }}
            >
              Browse Full Menu <ArrowRight size={16} style={{ marginLeft: '8px', flexShrink: 0 }} />
            </Link>

            {/* Footer tags */}
            <div style={{
              width: '100%',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(160,160,160,0.6)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                <Tag size={14} color="var(--primary-gold)" /> Seasonal Discounts
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(160,160,160,0.6)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                <Bell size={14} color="var(--primary-gold)" /> Instant Notifications
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Offers;
