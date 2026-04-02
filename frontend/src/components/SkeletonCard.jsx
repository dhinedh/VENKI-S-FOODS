import React from 'react';

/**
 * SkeletonCard.jsx
 * - A div matching FoodCard dimensions exactly.
 * - Inside: skeleton blocks for image area (200px height), title line,
 *   description line (shorter), price line, button.
 * - All blocks have shimmer animation via CSS background animation.
 */
const SkeletonCard = () => {
  return (
    <div className="skeleton-card glass-card">
      {/* Image Area */}
      <div className="skeleton skeleton-image"></div>
      
      <div className="skeleton-content">
        {/* Title Line */}
        <div className="skeleton skeleton-title"></div>
        
        {/* Description Lines */}
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
        
        {/* Footer Area */}
        <div className="skeleton-footer">
          <div className="skeleton skeleton-price"></div>
          <div className="skeleton skeleton-btn"></div>
        </div>
      </div>

      <style>{`
        .skeleton-card {
          width: 100%;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .skeleton-image { height: 200px; width: 100%; border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
        .skeleton-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: 1rem; }
        .skeleton-title { height: 28px; width: 70%; border-radius: var(--radius-sm); }
        .skeleton-text { height: 16px; width: 100%; border-radius: var(--radius-sm); }
        .skeleton-text.short { width: 40%; }
        .skeleton-footer { 
          margin-top: auto; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding-top: 1rem;
        }
        .skeleton-price { height: 24px; width: 60px; border-radius: var(--radius-sm); }
        .skeleton-btn { height: 40px; width: 40px; border-radius: 50%; }
      `}</style>
    </div>
  );
};

export default SkeletonCard;
