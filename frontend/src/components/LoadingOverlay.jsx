import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="loading-content"
      >
        <div className="loading-spinner"></div>
        <h2 className="loading-text">VENKI'S <span className="gold-text">FOODS</span></h2>
      </motion.div>

      <style>{`
        .loading-overlay {
          position: fixed;
          inset: 0;
          background: var(--bg-dark);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loading-content { text-align: center; }
        .loading-spinner {
          width: 50px; height: 50px;
          border: 2px solid var(--border-gold);
          border-top-color: var(--primary-gold);
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s infinite linear;
        }
        .loading-text { 
           font-size: 1.5rem; letter-spacing: 4px; color: var(--text-primary);
           font-family: var(--font-serif);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
