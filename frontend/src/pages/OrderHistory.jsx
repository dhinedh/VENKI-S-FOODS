import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, ChevronRight, ShoppingBag, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import api from '../lib/api';
import SEOHead from '../components/SEOHead';

/**
 * OrderHistory.jsx
 * - Fetch user orders from /api/orders/history/:userId.
 * - List of order cards: ID, Date, Total, Status Badge.
 * - Button: "View Details / Track" (Links to /track/:id).
 */
const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setUser(user);

        const { data } = await api.get(`/orders/history/${user.id}`);
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch order history:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <div className="loading-screen">Fetching Your Orders...</div>;
  }

  return (
    <div className="history-page container section-padding">
      <SEOHead title="My Orders" />
      
      <div className="section-header">
        <div>
          <span className="section-label">Account</span>
          <h1 className="section-title">Order <span>History</span></h1>
        </div>
        <div className="user-badge glass-card">
           <div className="user-icon">{user?.email?.[0].toUpperCase()}</div>
           <span>{user?.email}</span>
        </div>
      </div>

      <main className="history-list mt-10">
        {orders.length > 0 ? (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className="order-history-card glass-card anim-slide-in">
                <div className="oh-header">
                  <div className="oh-id">
                    <Package size={20} color="var(--primary-color)" />
                    <span>Order #{order.id.substring(0, 8)}</span>
                  </div>
                  <div className={`status-pill ${order.status}`}>
                    {order.status.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="oh-body">
                   <div className="oh-items">
                     {order.items.slice(0, 2).map((item, i) => (
                       <span key={i}>{item.name}{i < Math.min(order.items.length, 2) - 1 ? ', ' : ''}</span>
                     ))}
                     {order.items.length > 2 && <span className="text-secondary"> +{order.items.length - 2} more</span>}
                   </div>
                   <div className="oh-meta">
                     <span className="oh-date"><Clock size={14}/> {new Date(order.created_at).toLocaleDateString()}</span>
                     <span className="oh-total">₹{order.total_price}</span>
                   </div>
                </div>

                <div className="oh-footer">
                  <Link to={`/track/${order.id}`} className="btn btn-secondary btn-sm">
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-history text-center glass-card">
            <ShoppingBag size={64} opacity={0.2} />
            <h2>No orders found</h2>
            <p>Looks like you haven't placed any orders yet. Ready to try our heritage pickles?</p>
            <Link to="/menu" className="btn btn-primary mt-6">Start Shopping</Link>
          </div>
        )}
      </main>

      <style>{`
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .user-badge { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: 40px; font-weight: 600; font-size: 0.9rem; }
        .user-icon { width: 30px; height: 30px; background: var(--primary-color); border-radius: 50%; color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        
        .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
        .order-history-card { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        
        .oh-header { display: flex; justify-content: space-between; align-items: center; }
        .oh-id { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.1rem; }

        .oh-body { display: flex; flex-direction: column; gap: 1rem; }
        .oh-items { font-weight: 600; font-size: 0.95rem; color: #fff; }
        .oh-meta { display: flex; justify-content: space-between; align-items: center; }
        .oh-date { display: flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: 0.85rem; }
        .oh-total { font-size: 1.5rem; font-weight: 800; color: var(--primary-color); }
        
        .oh-footer { margin-top: auto; border-top: 1px solid var(--border-glass); padding-top: 1.5rem; }
        
        /* Status Pills Reuse */
        .status-pill { padding: 4px 12px; border-radius: 12px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; }
        .status-pill.pending { background: #444; color: #fff; }
        .status-pill.confirmed { background: var(--info); color: #000; }
        .status-pill.preparing { background: var(--warning); color: #000; }
        .status-pill.out_for_delivery, .status-pill.ready_for_pickup { background: var(--primary-color); color: #000; }
        .status-pill.delivered { background: var(--success); color: #fff; }
        .status-pill.cancelled { background: var(--error); color: #fff; }

        .empty-history { padding: 6rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }

        @media (max-width: 576px) {
          .orders-grid { grid-template-columns: 1fr; }
          .oh-total { font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default OrderHistory;
