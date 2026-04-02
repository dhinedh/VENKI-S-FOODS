import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, CheckCircle2, Clock, Truck, Store, 
  MapPin, Phone, RefreshCw, ChevronLeft, AlertCircle 
} from 'lucide-react';
import api from '../lib/api';
import SEOHead from '../components/SEOHead';

/**
 * OrderTrack.jsx
 * - Fetch order by id param from /api/orders/:id/track.
 * - Status Timeline: Show dots for pending, confirmed, preparing, 
 *   out_for_delivery / ready_for_pickup, delivered.
 * - Details: Items summary, Total, Delivery Type, Slot.
 * - Live Refresh button to refetch data.
 */
const OrderTrack = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${id}/track`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.error || "Order not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchOrder, 60000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading && !order) {
    return <div className="loading-screen">Locating Order {id ? `#${id.substring(0,8)}` : ''}...</div>;
  }

  if (error || !id) {
    return (
      <div className="container section-padding text-center">
        <SEOHead title="Track Your Order" />
        <div className="error-card glass-card max-w-2xl mx-auto p-12">
          <Package size={48} className="mx-auto mb-6 text-gold opacity-50" />
          <h1 className="font-serif text-4xl mb-4">Track Your <span className="gold-text">Order</span></h1>
          <p className="text-secondary mb-10">Enter your order ID below to see the live heritage preparation status.</p>
          
          <form className="track-input-group" onSubmit={(e) => {
            e.preventDefault();
            const val = e.target.trackId.value;
            if (val) window.location.href = `/track/${val}`;
          }}>
            <input 
              name="trackId"
              type="text" 
              placeholder="Enter Order ID (e.g. ord_123...)" 
              className="glass-input"
              required
            />
            <button type="submit" className="btn btn-primary">Track Now</button>
          </form>

          {error && <p className="mt-6 text-error font-bold flex items-center justify-center gap-2">
            <AlertCircle size={16} /> {error}
          </p>}
          
          <div className="mt-12 pt-8 border-t border-glass">
            <p className="text-xs text-secondary mb-4">Need help? WhatsApp our heritage support line</p>
            <Link to="/menu" className="btn btn-secondary btn-sm">Return to Menu</Link>
          </div>
        </div>
      </div>
    );
  }

  const statuses = [
    { key: 'pending', label: 'Order Placed', icon: <Package size={20}/> },
    { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 size={20}/> },
    { key: 'preparing', label: 'Preparing', icon: <Clock size={20}/> },
    { 
      key: order.delivery_type === 'delivery' ? 'out_for_delivery' : 'ready_for_pickup', 
      label: order.delivery_type === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup', 
      icon: order.delivery_type === 'delivery' ? <Truck size={20}/> : <Store size={20}/> 
    },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle2 size={20}/> }
  ];

  const currentStatusIndex = statuses.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="track-page container section-padding mobile-pt-6">
      <SEOHead title={`Track Order #${order.id.substring(0,8)}`} />
      
      <div className="track-header">
        <Link to="/orders" className="back-btn"><ChevronLeft /> Back to Orders</Link>
        <div className="header-main">
          <h1 className="font-serif text-4xl">Track Your <span className="gold-text">Order</span></h1>
          <button className="refresh-btn" onClick={fetchOrder} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh Status
          </button>
        </div>
      </div>

      <div className="track-layout mt-10">
        
        {/* Status Timeline */}
        <div className="track-main glass-card">
          <div className="order-summary-header">
            <div>
              <span className="order-tag">Order ID: #{order.id.substring(0,8)}</span>
              <p className="order-date">Placed on {new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div className={`status-pill ${order.status}`}>
              {order.status.replace(/_/g, ' ')}
            </div>
          </div>

          <div className="divider my-8"></div>

          {isCancelled ? (
            <div className="cancelled-notice">
               <AlertCircle size={32} />
               <div>
                 <h3>Order Cancelled</h3>
                 <p>{order.tracking_note || "This order has been cancelled. Please contact support for assistance."}</p>
               </div>
            </div>
          ) : (
            <div className="timeline-wrapper">
              {statuses.map((s, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div key={s.key} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="timeline-icon">{s.icon}</div>
                    <div className="timeline-content">
                      <h3>{s.label}</h3>
                      {isCurrent && order.tracking_note && (
                        <p className="status-note">{order.tracking_note}</p>
                      )}
                    </div>
                    {index < statuses.length - 1 && <div className="timeline-line"></div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Details Sidebar */}
        <aside className="track-details">
          <div className="details-card glass-card">
            <h3 className="font-serif text-xl mb-6">Delivery <span className="gold-text">Details</span></h3>
            <div className="detail-row mt-6">
              <div className="icon-circle"><Store size={18}/></div>
              <div>
                <p className="label">Delivery Type</p>
                <p className="value">{order.delivery_type.toUpperCase()}</p>
              </div>
            </div>
            
            <div className="detail-row">
              <div className="icon-circle"><Clock size={18}/></div>
              <div>
                <p className="label">Time Slot</p>
                <p className="value">{order.delivery_slot || "ASAP"}</p>
              </div>
            </div>

            {order.delivery_type === 'delivery' && (
              <div className="detail-row">
                <div className="icon-circle"><MapPin size={18}/></div>
                <div>
                  <p className="label">Delivery Address</p>
                  <p className="value">{order.address}</p>
                </div>
              </div>
            )}

            <div className="divider my-6"></div>

            <h3 className="font-serif text-xl mb-4">Order <span className="gold-text">Items</span></h3>
            <div className="order-mini-list mt-4">
              {order.items.map(item => (
                <div key={item.id} className="mini-item">
                  <span>{item.name} x{item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="divider my-6"></div>

            <div className="total-row">
              <span>Grand Total</span>
              <span>₹{order.total_price}</span>
            </div>
            <p className="payment-type">Payment Mode: <strong>Cod (Unpaid)</strong></p>
          </div>
        </aside>

      </div>

      <style>{`
        .track-header { margin-bottom: 2rem; }
        .back-btn { display: flex; align-items: center; gap: 5px; color: var(--text-secondary); font-weight: 600; margin-bottom: 1rem; transition: 0.3s; }
        .back-btn:hover { color: var(--primary-gold); }
        .header-main { display: flex; justify-content: space-between; align-items: center; }
        .refresh-btn { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--primary-gold); text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; }
        
        .track-layout { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; }
        .track-main { padding: 3rem; }
        .order-summary-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .order-tag { background: var(--primary-glow); padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: 800; color: var(--primary-gold); border: 1px solid var(--primary-gold); }
        .order-date { font-size: 0.9rem; color: var(--text-secondary); margin-top: 10px; font-weight: 500; }
        
        /* Status Pills */
        .status-pill { padding: 8px 18px; border-radius: 20px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
        .status-pill.pending { background: rgba(0,0,0,0.05); color: var(--text-secondary); }
        .status-pill.confirmed { background: rgba(0, 150, 255, 0.1); color: #0076ff; }
        .status-pill.preparing { background: var(--primary-glow); color: var(--primary-gold); }
        .status-pill.out_for_delivery, .status-pill.ready_for_pickup { background: var(--primary-gold); color: #fff; }
        .status-pill.delivered { background: rgba(0, 200, 83, 0.1); color: var(--success); }
        .status-pill.cancelled { background: rgba(255, 82, 82, 0.1); color: var(--error); }

        /* Timeline */
        .timeline-wrapper { display: flex; flex-direction: column; gap: 3.5rem; position: relative; padding-left: 20px; }
        .timeline-item { display: flex; gap: 2rem; position: relative; z-index: 1; }
        .timeline-icon { 
          width: 48px; height: 48px; border-radius: 50%; background: rgba(0,0,0,0.03); 
          display: flex; align-items: center; justify-content: center; color: var(--text-secondary);
          transition: 0.5s; border: 1px solid var(--border-glass);
        }
        .timeline-line { 
          position: absolute; left: 23px; top: 48px; width: 2px; height: 3.5rem; 
          background: rgba(0,0,0,0.05); z-index: -1; 
        }
        .timeline-item.completed .timeline-icon { background: var(--success); color: #fff; box-shadow: 0 0 15px rgba(0,200,83,0.3); border-color: var(--success); }
        .timeline-item.completed .timeline-line { background: var(--success); }
        .timeline-item.current .timeline-icon { background: var(--primary-gold); color: #fff; box-shadow: 0 0 20px var(--primary-glow); border-color: var(--primary-gold); }
        
        .timeline-content h3 { font-size: 1.15rem; color: var(--text-secondary); transition: 0.3s; font-weight: 700; margin: 0; }
        .timeline-item.completed h3, .timeline-item.current h3 { color: var(--text-primary); }
        .status-note { color: var(--primary-gold); font-size: 0.9rem; margin-top: 8px; font-weight: 600; font-style: italic; }

        .cancelled-notice { display: flex; gap: 20px; background: rgba(255, 82, 82, 0.1); border: 1px solid var(--error); padding: 2rem; border-radius: var(--radius-md); color: var(--error); }

        /* Order Details Sidebar */
        .details-card { padding: 2.5rem; }
        .detail-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .icon-circle { width: 40px; height: 40px; border-radius: 50%; background: var(--primary-glow); display: flex; align-items: center; justify-content: center; color: var(--primary-gold); border: 1px solid var(--border-glass); }
        .detail-row .label { font-size: 0.8rem; color: var(--text-secondary); font-weight: 700; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 1px; }
        .detail-row .value { font-weight: 700; font-size: 1rem; color: var(--text-primary); }
        
        .mini-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.95rem; color: var(--text-primary); font-weight: 500; }
        .total-row { display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-serif); border-top: 1px solid var(--border-glass); padding-top: 20px; }
        .payment-type { font-size: 0.85rem; margin-top: 15px; color: var(--text-secondary); font-weight: 600; }

        @media (max-width: 991px) {
          .track-layout { grid-template-columns: 1fr; }
          .track-details { order: 1; }
        }
      `}</style>
    </div>
  );
};

export default OrderTrack;
