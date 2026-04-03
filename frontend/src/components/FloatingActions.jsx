import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot, X, Send, Sparkles } from 'lucide-react';

const FloatingActions = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

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
        {showTooltip && !isChatOpen && (
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

      <div className="actions-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* WhatsApp Icon */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          onMouseEnter={() => setShowTooltip(false)}
        >
          <MessageCircle size={28} fill="currentColor" fillOpacity={0.1} />
        </motion.a>

        {/* AI Chat Bot Icon */}
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="action-btn ai-btn glass-card"
          style={{
            width: '3.5rem',
            height: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: 'var(--primary-gold)',
            cursor: 'pointer',
            border: '1px solid var(--border-gold)',
            boxShadow: '0 10px 25px var(--primary-glow)'
          }}
        >
          {isChatOpen ? <X size={24} /> : <Bot size={28} />}
        </motion.button>
      </div>

      {/* Mock AI Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mini-chat-modal glass-card"
            style={{
              position: 'absolute',
              bottom: '5rem',
              right: '0',
              width: '320px',
              height: '420px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              border: '1px solid var(--border-gold)'
            }}
          >
            {/* Chat Header */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'var(--gold-gradient)', 
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Sparkles size={20} />
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Heritage Assistant</h4>
                <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.9 }}>Online • AI Powered</p>
              </div>
            </div>

            {/* Chat Content */}
            <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="msg-ai glass-card" style={{ padding: '0.8rem', fontSize: '0.9rem', maxWidth: '85%', borderBottomLeftRadius: '0' }}>
                Namaste! I'm your AI heritage guide. How can I help you choose the perfect pickle today?
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {['Best Sellers?', 'Mild or Spicy?', 'Shelf Life?'].map(txt => (
                  <button key={txt} style={{ 
                    fontSize: '0.7rem', 
                    padding: '5px 12px', 
                    borderRadius: '20px', 
                    border: '1px solid var(--border-gold)',
                    color: 'var(--text-gold)',
                    background: 'var(--primary-glow)'
                  }}>
                    {txt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Type your message..." 
                disabled
                style={{ 
                  flex: 1, 
                  background: 'rgba(0,0,0,0.03)', 
                  border: 'none', 
                  padding: '8px 15px', 
                  borderRadius: '20px',
                  fontSize: '0.85rem'
                }} 
              />
              <button style={{ color: 'var(--primary-gold)' }}><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          .mini-chat-modal {
            width: calc(100vw - 1.5rem) !important;
            right: 0 !important;
            bottom: 4.5rem !important;
            height: 360px !important;
            max-height: 60vh !important;
          }
          .support-tooltip { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default FloatingActions;
