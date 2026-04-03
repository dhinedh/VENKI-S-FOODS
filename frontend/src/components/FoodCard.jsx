import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Star, Eye } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { supabase } from '../lib/supabase';
import LazyImage from './LazyImage';

/**
 * FoodCard.jsx - Luxury Edition
 * Features:
 * - Hover-triggered y-axis lift
 * - Glassmorphism base with gold border on hover
 * - Diet badges (Veg/Non-veg) with glowing dots
 * - Parallax-style image zoom
 * - "Quick Add" brushed gold button
 */
const FoodCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    addItem({ ...product });
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="food-card glass-card group"
    >
      <Link to={`/menu/${product.id}`} className="card-inner">
        {/* Status & Diet Badges */}
        <div className="card-badges">
          {product.is_veg ? (
            <div className="badge-diet veg" title="Vegetarian">
              <div className="dot"></div>
            </div>
          ) : (
            <div className="badge-diet non-veg" title="Non-Vegetarian">
              <div className="dot"></div>
            </div>
          )}
          {product.is_available === false && (
            <span className="badge-sold-out">Sold Out</span>
          )}
          {product.originalPrice && (
            <span className="badge-offer">Offer</span>
          )}
        </div>

        {/* Premium Image Container */}
        <div className="card-img-wrapper">
          <LazyImage 
            src={product.image} 
            alt={product.name} 
            className="card-img group-hover:scale-110" 
          />
          <div className="card-overlay">
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               whileHover={{ opacity: 1, y: 0 }}
               className="overlay-btn"
             >
               <Eye size={20} />
             </motion.div>
          </div>
        </div>

        {/* Detailed Content */}
        <div className="card-content">
          <div className="card-meta">
            <span className="card-category">{product.category}</span>
            <div className="card-rating">
               <Star size={12} fill="var(--primary-gold)" color="var(--primary-gold)" />
               <span>4.8</span>
            </div>
          </div>
          
          <h3 className="card-title">{product.name}</h3>
          
          <div className="card-extra-info">
             <span className="weight-tag">{product.weight}</span>
             <span className="refrigeration-badge">Keep Refrigerated</span>
          </div>
          
          <div className="card-footer">
            <div className="price-tag">
              <span className="currency">₹</span>
              <span className="amount">{product.price}</span>
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="quick-add-btn"
              disabled={!product.is_available}
              aria-label="Add to cart"
            >
              <Plus size={20} />
            </motion.button>
          </div>
        </div>
      </Link>

      <style>{`
.card-extra-info { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          margin-bottom: 2rem; 
          flex-wrap: wrap; 
        }
        .weight-tag { 
          font-size: 0.75rem; 
          font-weight: 800; 
          color: var(--text-secondary); 
          background: rgba(0,0,0,0.04); 
          padding: 4px 10px; 
          border-radius: 6px;
          white-space: nowrap;
        }
        .refrigeration-badge { 
          font-size: 0.65rem; 
          font-weight: 800; 
          color: var(--primary-gold); 
          border: 1px solid var(--border-gold); 
          padding: 3px 8px; 
          border-radius: 6px; 
          text-transform: uppercase; 
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .food-card { 
          position: relative; 
          border-radius: 24px; 
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .card-inner { display: flex; flex-direction: column; height: 100%; }

        .card-badges { 
          position: absolute; top: 15px; left: 15px; z-index: 10; 
          display: flex; align-items: center; gap: 8px;
        }
        .badge-diet { 
          width: 20px; height: 20px; border: 1.5px solid rgba(0,0,0,0.1); 
          padding: 3px; border-radius: 4px; background: rgba(255,255,255,0.6);
          backdrop-filter: blur(4px);
        }
        .badge-diet .dot { width: 100%; height: 100%; border-radius: 50%; }
        .badge-diet.veg .dot { background: #10B981; }
        .badge-diet.non-veg .dot { background: #EF4444; }
        
        .badge-sold-out {
          background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
          font-size: 0.65rem; font-weight: 800; padding: 4px 10px; 
          border-radius: 20px;
          color: #fff; text-transform: uppercase; letter-spacing: 1px;
        }
        .badge-offer {
          background: var(--gold-gradient);
          color: #fff;
          font-size: 0.6rem; font-weight: 900; padding: 4px 12px;
          border-radius: 20px;
          text-transform: uppercase; letter-spacing: 1px;
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .card-img-wrapper { 
          height: 260px; margin: 10px; border-radius: 20px; 
          overflow: hidden; position: relative; 
        }
        .card-img { 
          width: 100%; height: 100%; object-fit: cover; 
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-overlay {
          position: absolute; inset: 0; background: rgba(255,255,255,0.2);
          opacity: 0; transition: 0.4s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .group:hover .card-overlay { opacity: 1; }
        .overlay-btn {
          width: 48px; height: 48px; background: #000; color: #fff;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .card-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
        .card-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .card-category { 
          font-size: 0.7rem; font-weight: 800; color: var(--primary-gold); 
          text-transform: uppercase; letter-spacing: 2px; 
        }
        .card-rating { display: flex; align-items: center; gap: 4px; font-weight: 700; font-size: 0.8rem; }
        
        .card-title { font-size: 1.35rem; color: var(--text-primary); font-family: var(--font-serif); margin-bottom: 1.5rem; line-height: 1.2; }
        
        .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .price-tag { display: flex; align-items: baseline; gap: 2px; }
        .currency { font-size: 0.85rem; font-weight: 700; color: var(--primary-gold); }
        .amount { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); }
        .original-price { 
          font-size: 0.9rem; 
          color: var(--text-secondary); 
          text-decoration: line-through; 
          margin-left: 8px;
          opacity: 0.7;
        }
        
        .quick-add-btn {
          width: 48px; height: 48px; background: var(--gold-brushed); color: #000;
          border-radius: 16px; display: flex; align-items: center; justify-content: center;
          transition: 0.3s; border: none; cursor: pointer;
        }
        .quick-add-btn:hover:not(:disabled) { transform: scale(1.05); filter: brightness(1.1); box-shadow: 0 5px 15px var(--primary-glow); }
        .quick-add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 500px) {
          .card-img-wrapper { height: 160px; margin: 6px; }
          .card-content { padding: 1rem; }
          .card-title { font-size: 1.1rem; margin-bottom: 1rem; }
          .amount { font-size: 1.2rem; }
          .quick-add-btn { width: 36px; height: 36px; border-radius: 10px; }
          .badge-diet { width: 16px; height: 16px; }
          .card-category { font-size: 0.6rem; letter-spacing: 1px; }
          .card-extra-info { gap: 6px; margin-bottom: 1rem; }
          .weight-tag, .refrigeration-badge { font-size: 0.55rem; padding: 2px 6px; }
        }
      `}</style>
    </motion.div>
  );
};

export default FoodCard;
