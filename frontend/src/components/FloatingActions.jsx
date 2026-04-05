import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const FloatingActions = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const cartCount = useCartStore(state => state.getCount());

  const whatsappNumber = "+917200883609";
  const whatsappMessage = encodeURIComponent("Namaste Venki's Foods! I'd like to know more about your artisanal pickles.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="floating-actions-wrapper" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="support-tooltip glass-card"
            style={{
              position: 'absolute',
              right: '4.5rem',
              bottom: '1rem',
              padding: '0.8rem 1.2rem',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: '1px solid var(--border-gold)',
              borderRadius: '15px'
            }}
          >
            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              How can we help you today? ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="actions-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>

        {/* Cart Icon Container */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence>
            {hoveredItem === 'cart' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                style={{
                  position: 'absolute',
                  right: '100%',
                  marginRight: '12px',
                  background: 'var(--primary-dark, #1a1a1a)',
                  color: 'var(--primary-gold, #cfb53b)',
                  border: '1px solid var(--border-gold, #cfb53b)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                View Cart
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onMouseEnter={() => setHoveredItem('cart')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              to="/cart"
              className="action-btn cart-btn glass-card"
              style={{
                width: '3.5rem',
                height: '3.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                color: 'var(--primary-gold, #cfb53b)',
                cursor: 'pointer',
                border: '1px solid var(--border-gold, rgba(207, 181, 59, 0.3))',
                boxShadow: '0 10px 25px rgba(207, 181, 59, 0.15)',
                position: 'relative',
                textDecoration: 'none'
              }}
            >
              <ShoppingCart size={26} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        </div>

        {/* WhatsApp Icon Container */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence>
            {hoveredItem === 'whatsapp' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                style={{
                  position: 'absolute',
                  right: '100%',
                  marginRight: '12px',
                  background: 'var(--primary-dark, #1a1a1a)',
                  color: '#25D366',
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                Chat with us
              </motion.div>
            )}
          </AnimatePresence>
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onMouseEnter={() => {
              setShowTooltip(false);
              setHoveredItem('whatsapp');
            }}
            onMouseLeave={() => setHoveredItem(null)}
            className="action-btn whatsapp-btn glass-card"
            style={{
              width: '3.5rem',
              height: '3.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              color: '#25D366',
              cursor: 'pointer',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              boxShadow: '0 10px 20px rgba(37, 211, 102, 0.15)'
            }}
          >
            <MessageCircle size={28} fill="currentColor" fillOpacity={0.1} />
          </motion.a>
        </div>

      </div>

      <style>{`
        /* Mobile: add safe-area clearance for browser chrome & OS gesture bar */
        @media (max-width: 768px) {
          .floating-actions-wrapper {
            bottom: calc(env(safe-area-inset-bottom, 0px) + 20px) !important;
            right: 0.75rem !important;
          }
          .action-btn {
            width: 2.75rem !important;
            height: 2.75rem !important;
          }
          .support-tooltip { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default FloatingActions;
