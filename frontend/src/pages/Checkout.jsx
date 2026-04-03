import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, Store, Clock, Ticket, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import useCartStore from '../store/cartStore';
import api from '../lib/api';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

/**
 * Checkout.jsx
 * - Form: Name, Phone, Delivery Type (Delivery/Store Pickup).
 * - If Delivery: Address field.
 * - Delivery Slot dropdown.
 * - Summary: Items, Subtotal, Delivery Charge, Discount (via Coupon).
 * - Coupon Input: Validate against /api/orders/validate-coupon.
 * - Order Button: Call /api/orders POST.
 * - Success: Redirect to /track/:id.
 */
const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_type: 'delivery',
    address: '',
    delivery_slot: '11am-1pm'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Delivery Settings (Hardcoded as per spec or fetched from API)
  const deliveryCharge = (subtotal >= 300 || formData.delivery_type === 'pickup') ? 0 : 40;
  const totalPrice = subtotal + deliveryCharge;

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      setFormData(prev => ({ 
        ...prev, 
        customer_name: user.user_metadata?.full_name || '',
        customer_phone: user.phone || '' 
      }));
    };
    fetchUser();
    
    if (cartItems.length === 0) {
      navigate('/menu');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (formData.delivery_type === 'delivery' && !formData.address) {
        throw new Error("Delivery address is required.");
      }

      const orderData = {
        user_id: user?.id,
        items: cartItems,
        ...formData
      };

      const { data } = await api.post('/orders', orderData);
      
      if (data.success) {
        clearCart();
        navigate(`/track/${data.order_id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page container section-padding mobile-pt-6">
      <SEOHead title="Checkout | Secure Ordering" />
      
      <div className="checkout-layout">
        
        {/* Checkout Form */}
        <div className="checkout-main glass-card">
          <h2 className="section-subtitle mb-8 font-serif text-3xl">Order <span className="gold-text">Information</span></h2>
          <form onSubmit={handleSubmitOrder}>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Receiver's Name</label>
                <input 
                  type="text" name="customer_name" required 
                  value={formData.customer_name} onChange={handleInputChange} 
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div className="form-group">
                <label>Phone Number (WhatsApp preferred)</label>
                <input 
                  type="tel" name="customer_phone" required 
                  value={formData.customer_phone} onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            <div className="form-group mt-6">
              <label>How would you like to receive your order?</label>
              <div className="type-toggle">
                <button 
                  type="button" 
                  className={`type-btn ${formData.delivery_type === 'delivery' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, delivery_type: 'delivery'})}
                >
                  <Truck size={20} /> Doorstep Delivery
                </button>
                <button 
                  type="button" 
                  className={`type-btn ${formData.delivery_type === 'pickup' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, delivery_type: 'pickup'})}
                >
                  <Store size={20} /> Store Pickup
                </button>
              </div>
            </div>

            {formData.delivery_type === 'delivery' && (
              <div className="form-group mt-6 animate-fade">
                <label>Delivery Address</label>
                <textarea 
                  name="address" rows="3" required
                  value={formData.address} onChange={handleInputChange}
                  placeholder="Full flat/house no., Building, Area/Street..."
                ></textarea>
              </div>
            )}

            <div className="form-group mt-6">
              <label>Select Time Slot</label>
              <div className="slot-grid">
                {['11am-1pm', '2pm-5pm', '6pm-9pm'].map(slot => (
                  <label key={slot} className={`slot-card ${formData.delivery_slot === slot ? 'active' : ''}`}>
                    <input 
                      type="radio" name="delivery_slot" value={slot} 
                      checked={formData.delivery_slot === slot} 
                      onChange={handleInputChange}
                    />
                    <Clock size={18} />
                    <span>{slot}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="form-error">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full mt-8" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="animate-spin" /> Processing...</> : <>Complete Order <ArrowRight /></>}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <aside className="checkout-summary">
          <div className="summary-card glass-card sticky-top">
            <h3 className="font-serif text-2xl mb-6">Your <span className="gold-text">Order</span></h3>
            <div className="items-mini-list mt-6">
              {cartItems.map(item => (
                <div key={item.id} className="item-mini">
                  <span>{item.name} x{item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="divider my-6"></div>

            <div className="calc-row mt-6">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="calc-row">
              <span>Delivery</span>
              <span className={deliveryCharge === 0 ? 'free' : ''}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="calc-row total mt-4">
              <span>Total Amount</span>
              <span>₹{totalPrice}</span>
            </div>

            <p className="payment-note mt-6">
              Currently accepting <strong>Online Payment (UPI / Bank Transfer)</strong>. 
              <br/>Place your order first, then pay using the details on the next screen.
            </p>
            <div style={{
              marginTop: '1rem', padding: '0.9rem 1rem',
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem', lineHeight: 1.6
            }}>
              <p style={{ color: 'var(--primary-gold)', fontWeight: 700, marginBottom: '4px' }}>
                🚚 Dispatch: 5 Working Days
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                Questions? WhatsApp us at{' '}
                <a href="https://wa.me/917200883609" target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--primary-gold)', fontWeight: 600 }}>
                  +91 72008 83609
                </a>
              </p>
            </div>
          </div>
        </aside>

      </div>

      <style>{`
        .checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; }
        .checkout-main { padding: 2.5rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 0.8rem; color: var(--text-primary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
        .form-group input, .form-group textarea {
          width: 100%; background: rgba(0,0,0,0.03); border: 1px solid var(--border-glass);
          border-radius: var(--radius-md); padding: 14px 18px; color: var(--text-primary); font-family: inherit;
          transition: 0.3s;
        }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--primary-gold); outline: none; box-shadow: 0 0 15px var(--primary-glow); }
        
        .type-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .type-btn {
          padding: 15px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);
          color: var(--text-secondary); font-weight: 600; display: flex; align-items: center; gap: 10px; justify-content: center;
          transition: 0.3s; background: none;
        }
        .type-btn.active { background: var(--primary-glow); border-color: var(--primary-gold); color: var(--primary-gold); }

        .slot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .slot-card {
           padding: 15px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);
           cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: 0.3s;
           color: var(--text-secondary);
        }
        .slot-card input { display: none; }
        .slot-card.active { border-color: var(--primary-gold); background: var(--primary-glow); color: var(--primary-gold); }

        .summary-card { padding: 2.5rem; }
        .item-mini { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.95rem; color: var(--text-primary); font-weight: 500; }
        .calc-row { display: flex; justify-content: space-between; margin-bottom: 12px; color: var(--text-secondary); font-weight: 500; }
        .calc-row.total { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); border-top: 1px solid var(--border-glass); padding-top: 20px; font-family: var(--font-serif); }
        .calc-row .free { color: var(--success); font-weight: 700; }
        
        .btn-full { width: 100%; justify-content: center; }
        .form-error { margin-top: 2rem; background: rgba(255, 82, 82, 0.1); border: 1px solid var(--error); color: var(--error); padding: 1rem; border-radius: var(--radius-md); display: flex; items-center; gap: 10px; }
        
        .animate-fade { animation: fadeIn 0.3s ease; }
        .divider { height: 1px; background: var(--border-glass); }
        .mt-8 { margin-top: 2rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .my-6 { margin: 1.5rem 0; }
        
        @media (max-width: 991px) {
          .checkout-layout { display: flex; flex-direction: column; gap: 2rem; }
          .checkout-summary { order: 2; }
          .checkout-main { order: 1; padding: 1.5rem; }
          .form-grid { grid-template-columns: 1fr; gap: 1rem; }
          .slot-grid { grid-template-columns: 1fr; }
          .type-toggle { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
