import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/cartStore';
import SEOHead from '../components/SEOHead';
import LazyImage from '../components/LazyImage';

/**
 * Cart.jsx
 * - Table: Product Image/Name, Qty (+/-), Subtotal, Remove (X).
 * - Summary: Subtotal, Delivery Charge estimate.
 * - Button: "Proceed to Checkout" (Links to /checkout).
 * - Empty State: "Your cart is empty" with "Browse Menu" button.
 */
const Cart = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getTotal());

  const deliveryThreshold = 300;
  const isFreeDelivery = subtotal >= deliveryThreshold;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page container section-padding">
        <SEOHead title="Your Cart is Empty" />
        <div className="empty-cart-container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="empty-cart-card glass-card text-center"
          >
            <div className="empty-icon-wrapper">
              <ShoppingBag size={80} className="text-gold anim-pulse-slow" />
              <div className="icon-glow"></div>
            </div>
            <h2 className="empty-title">Your cart is as empty as a spice jar <br/> <span className="gold-text italic">without mango!</span></h2>
            <p className="text-secondary mb-8 text-lg">Browse our heritage menu and pick your favorites.</p>
            <Link to="/menu" className="btn btn-primary px-12 py-4 rounded-full shadow-lg">
              Explore Our Heritage Menu <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container section-padding mobile-pt-6">
      <SEOHead title={`Cart (${cartItems.length} items)`} />
      
      <div className="cart-layout">
        
        {/* Main Cart Table */}
        <div className="cart-main">
          <h1 className="section-title mb-8">Your <span>Shopping Cart</span></h1>
          
          <div className="cart-table-header glass-card">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>

          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item glass-card anim-slide-in">
                <div className="item-info">
                  <div className="item-img-sm">
                    <LazyImage src={item.image} alt={item.name} />
                  </div>
                  <div>
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price-unit">₹{item.price} per unit</p>
                    <button className="remove-item" onClick={() => removeItem(item.id)}>
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>

                <div className="item-qty-controls">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={16} /></button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={16} /></button>
                </div>

                <div className="item-total text-right">
                  ₹{item.price * item.qty}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-actions mt-8">
            <Link to="/menu" className="btn btn-secondary">
              <Plus size={18} /> Add More Items
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <aside className="cart-summary">
          <div className="summary-card glass-card">
            <h3>Order Summary</h3>
            
            <div className="summary-row mt-6">
              <span>Items Total</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <div className="delivery-label">
                 <span>Delivery Charge</span>
                 <p className="text-xs text-secondary">Free delivery above ₹{deliveryThreshold}</p>
              </div>
              <span className={isFreeDelivery ? 'free-text' : ''}>
                {isFreeDelivery ? 'FREE' : '₹40'}
              </span>
            </div>

            {!isFreeDelivery && (
              <div className="delivery-tip glass-card">
                <Truck size={18} color="var(--primary-color)" />
                <p>Add <strong>₹{deliveryThreshold - subtotal}</strong> more for FREE delivery!</p>
              </div>
            )}

            <div className="divider my-6"></div>

            <div className="summary-row total">
              <span>Estimated Total</span>
              <span>₹{subtotal + (isFreeDelivery ? 0 : 40)}</span>
            </div>

            <button className="btn btn-primary btn-full mt-8 btn-lg" onClick={() => navigate('/checkout')}>
               Proceed to Checkout <ArrowRight size={20} />
            </button>

            <div className="summary-footer mt-6">
               <div className="footer-item"><ShieldCheck size={16}/> Secure Payment</div>
               <div className="footer-item"><ShoppingBag size={16}/> 100% Authentic Quality</div>
            </div>
          </div>
        </aside>

      </div>

      <style>{`
        .cart-layout { display: grid; grid-template-columns: 1fr 380px; gap: 4rem; }
        .cart-table-header { display: grid; grid-template-columns: 2fr 1fr 0.5fr; padding: 1rem 2rem; margin-bottom: 1rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }
        
        .cart-item { display: grid; grid-template-columns: 2fr 1fr 0.5fr; padding: 1.5rem 2rem; align-items: center; margin-bottom: 1rem; }
        .item-info { display: flex; align-items: center; gap: 1.5rem; }
        .item-img-sm { width: 80px; height: 80px; border-radius: var(--radius-md); overflow: hidden; }
        .item-name { font-size: 1.15rem; margin-bottom: 0.2rem; }
        .item-price-unit { color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.5rem; }
        .remove-item { display: flex; align-items: center; gap: 5px; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .remove-item:hover { color: var(--error); }
        
        .item-qty-controls { display: flex; align-items: center; justify-content: center; gap: 1rem; }
        .item-qty-controls button { width: 32px; height: 32px; border: 1px solid var(--border-glass); border-radius: 50%; color: var(--primary-color); display: flex; align-items: center; justify-content: center; }
        .item-qty-controls span { font-weight: 700; min-width: 20px; text-align: center; }

        .item-total { font-weight: 700; font-size: 1.2rem; }
        
        .summary-card { padding: 2.5rem; position: sticky; top: 120px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; color: var(--text-secondary); font-weight: 600; }
        .summary-row.total { color: var(--text-primary); font-size: 1.5rem; font-weight: 800; border-top: 1px solid var(--border-glass); padding-top: 20px; }
        .free-text { color: var(--success); }
        .delivery-tip { display: flex; align-items: center; gap: 12px; padding: 1rem; margin: 1rem 0; font-size: 0.85rem; color: var(--text-primary); border: 1px solid var(--border-gold); }

        .summary-footer { display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--border-glass); padding-top: 20px; }
        .footer-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; }
        .btn-full { width: 100%; justify-content: center; }

        .empty-cart-container { 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 40vh; 
          width: 100%;
          padding: 2rem 0;
        }
        .empty-cart-card { 
          padding: 6rem 4rem; 
          width: 100%;
          max-width: 900px;
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center;
          gap: 2rem; 
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .empty-title { 
          font-size: 3rem; 
          line-height:1.2; 
          margin-bottom: 0.5rem; 
          max-width: 600px;
        }
        .empty-icon-wrapper { 
          position: relative; 
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }
        .text-gold { color: var(--primary-gold); }
        .icon-glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 140px; height: 140px; background: var(--primary-gold); 
          filter: blur(70px); opacity: 0.15; z-index: -1;
        }
        .anim-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        @media (max-width: 991px) {
          .cart-layout { grid-template-columns: 1fr; display: flex; flex-direction: column; }
          .cart-table-header { display: none; }
          .cart-item { grid-template-columns: 1fr; gap: 1.5rem; }
          .item-info { width: 100%; }
          .item-qty-controls { justify-content: flex-start; }
          .item-total { text-align: left; border-top: 1px solid var(--border-glass); padding-top: 1rem; }
          .cart-summary { order: 2; }
          .cart-main { order: 1; }
        }
      `}</style>
    </div>
  );
};

export default Cart;
