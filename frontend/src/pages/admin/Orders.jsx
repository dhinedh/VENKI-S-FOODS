import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, Phone, 
  ChevronRight, ArrowLeft, Loader2, CheckCircle2, 
  MapPin, Clock, Edit3, Send, X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import SEOHead from '../../components/SEOHead';

/**
 * Orders.jsx (Admin)
 * - Fetch all orders from /api/admin/orders.
 * - Filter by status.
 * - List: Order ID, Customer Name, Total, Status Dropdown.
 * - On Status Change: PATCH to /api/admin/orders/:id with optional tracking_note.
 */
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Update Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', tracking_note: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/orders?status=${statusFilter}`);
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.patch(`/admin/orders/${selectedOrder.id}`, updateForm);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions = [
    'pending', 'confirmed', 'preparing', 'out_for_delivery', 
    'ready_for_pickup', 'delivered', 'cancelled'
  ];

  const filteredOrders = orders.filter(o => 
    o.id.includes(searchQuery.toLowerCase()) || 
    o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-orders container section-padding">
      <SEOHead title="Admin | Order Management" />
      
      <div className="admin-header">
        <div>
          <Link to="/admin" className="back-link"><ArrowLeft size={16}/> Dashboard</Link>
          <h1 className="mt-2">Manage <span>Orders</span></h1>
        </div>
        <div className="admin-filters">
           <div className="adm-search">
              <Search size={18} className="srch-icon"/>
              <input 
                type="text" placeholder="Search ID or Name..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <select 
             className="status-select"
             value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
           >
             <option value="">All Statuses</option>
             {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
           </select>
        </div>
      </div>

      <main className="orders-list mt-6">
        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin" size={48}/></div>
        ) : filteredOrders.length > 0 ? (
          <div className="orders-cards">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card glass-card">
                {/* Top Row: ID + Status */}
                <div className="order-card-top">
                  <div>
                    <span className="order-id">#{order.id.substring(0,8)}</span>
                    <span className={`type-tag ml-2`}>{order.delivery_type}</span>
                  </div>
                  <div className={`status-pill ${order.status}`}>{order.status.replace(/_/g, ' ')}</div>
                </div>

                {/* Customer Info */}
                <div className="order-card-customer">
                  <p className="customer-name">{order.customer_name}</p>
                  <a href={`tel:${order.customer_phone}`} className="customer-phone">
                    <Phone size={14}/> {order.customer_phone}
                  </a>
                </div>

                {/* Order Meta Row */}
                <div className="order-card-meta">
                  <div className="meta-item">
                    <Clock size={14}/>
                    <span>{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {order.delivery_slot && (
                    <div className="meta-item">
                      <MapPin size={14}/>
                      <span>{order.delivery_slot}</span>
                    </div>
                  )}
                </div>

                {/* Total + Action */}
                <div className="order-card-footer">
                  <span className="order-total">₹{order.total_price}</span>
                  <button className="btn btn-primary btn-update" onClick={() => {
                    setSelectedOrder(order);
                    setUpdateForm({ status: order.status, tracking_note: order.tracking_note || '' });
                  }}>
                    <Edit3 size={16}/> Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data glass-card">No orders found matching your criteria.</div>
        )}
      </main>

      {/* Update Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content glass-card anim-slide-in">
            <div className="modal-header">
               <h3>Update Order #{selectedOrder.id.substring(0,8)}</h3>
               <button onClick={() => setSelectedOrder(null)}><X /></button>
            </div>
            <form onSubmit={handleUpdateStatus}>
               <div className="form-group mb-6">
                 <label>Set Status</label>
                 <select 
                   required className="w-full"
                   value={updateForm.status} onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                 >
                   {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                 </select>
               </div>
               <div className="form-group mb-6">
                 <label>Tracking Note (Optional - Sent to WhatsApp)</label>
                 <textarea 
                   rows="3" className="w-full"
                   placeholder="e.g. Delivery guy is near Seawoods Station"
                   value={updateForm.tracking_note} onChange={(e) => setUpdateForm({...updateForm, tracking_note: e.target.value})}
                 ></textarea>
               </div>
               <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                     {isUpdating ? "Saving..." : "Save Status"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        /* Mobile-first admin header */
        .admin-header { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
        .admin-header h1 { font-size: 1.6rem; }
        .admin-header h1 span { color: var(--primary-gold); }
        .admin-filters { display: flex; flex-direction: column; gap: 1rem; }

        /* Fixed search bar with explicit flex-row */
        .adm-search {
            display: flex !important; flex-direction: row !important;
            align-items: center; gap: 12px; padding: 13px 16px;
            border-radius: var(--radius-md); border: 1px solid var(--border-glass);
            background: rgba(255,255,255,0.04); transition: 0.3s;
        }
        .adm-search:focus-within { border-color: rgba(212,175,55,0.4); background: rgba(212,175,55,0.03); }
        .adm-search .srch-icon { color: var(--primary-gold); flex-shrink: 0; }
        .adm-search input { background: none; border: none; color: #fff; font-family: inherit; font-size: 0.95rem; width: 100%; outline: none; }
        .adm-search input::placeholder { color: rgba(255,255,255,0.3); }

        .status-select { background: rgba(255,255,255,0.04) !important; color: #fff; border: 1px solid var(--border-glass) !important; padding: 13px 16px; border-radius: var(--radius-md); font-weight: 600; font-family: inherit; font-size: 0.9rem; cursor: pointer; width: 100%; outline: none; transition: 0.3s; }
        .status-select:focus { border-color: rgba(212,175,55,0.4) !important; }

        /* Order Cards — Mobile First */
        .orders-cards { display: flex; flex-direction: column; gap: 1rem; }
        .order-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; border-radius: var(--radius-lg); border: 1px solid var(--border-glass); transition: 0.3s; }
        .order-card:hover { border-color: var(--border-gold); }

        .order-card-top { display: flex; justify-content: space-between; align-items: center; }
        .order-id { font-weight: 900; font-size: 1rem; color: #fff; font-family: monospace; }
        .type-tag { font-size: 0.65rem; text-transform: uppercase; color: var(--primary-gold); font-weight: 800; letter-spacing: 1px; background: var(--primary-glow); padding: 2px 8px; border-radius: 10px; }
        .ml-2 { margin-left: 8px; }

        .order-card-customer { display: flex; flex-direction: row; justify-content: space-between; align-items: center; }
        .customer-name { font-weight: 700; font-size: 1rem; color: #fff; }
        .customer-phone { display: flex; align-items: center; gap: 6px; color: var(--primary-gold); font-weight: 600; font-size: 0.85rem; text-decoration: none; }

        .order-card-meta { display: flex; flex-wrap: wrap; gap: 1rem; }
        .meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; }

        .order-card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-glass); padding-top: 1rem; }
        .order-total { font-size: 1.4rem; font-weight: 800; color: var(--primary-gold); font-family: var(--font-serif); }
        .btn-update { display: flex; align-items: center; gap: 8px; padding: 10px 20px; }

        /* Status Pills */
        .status-pill { padding: 6px 12px; border-radius: 20px; font-weight: 800; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; display: inline-block; text-align: center; }
        .status-pill.pending { background: rgba(255,255,255,0.1); color: #fff; }
        .status-pill.confirmed { background: rgba(64, 196, 255, 0.1); color: #40c4ff; border: 1px solid rgba(64, 196, 255, 0.2); }
        .status-pill.preparing { background: rgba(245, 158, 11, 0.1); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.2); }
        .status-pill.out_for_delivery, .status-pill.ready_for_pickup { background: rgba(212, 175, 55, 0.1); color: var(--primary-gold); border: 1px solid rgba(212, 175, 55, 0.2); }
        .status-pill.delivered { background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.2); }
        .status-pill.cancelled { background: rgba(239, 68, 68, 0.1); color: var(--error); border: 1px solid rgba(239, 68, 68, 0.2); }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 3000; display: flex; align-items: flex-end; justify-content: center; padding: 0; }
        .modal-content { max-width: 600px; width: 100%; padding: 2rem; border: 1px solid var(--border-gold); border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header h3 { font-family: var(--font-serif); font-size: 1.3rem; color: #fff; margin: 0; }
        .modal-header button { color: var(--text-secondary); transition: 0.3s; }
        .modal-header button:hover { color: #fff; }
        .modal-actions { display: flex; justify-content: stretch; gap: 1rem; margin-top: 2rem; }
        .modal-actions button { flex: 1; padding: 14px; }
        
        .form-group label { display: block; font-weight: 700; color: var(--primary-gold); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; }
        .form-group select, .form-group textarea { background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 14px; color: #fff; font-family: inherit; width: 100%; transition: 0.3s; }
        .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--primary-gold); background: rgba(212, 175, 55, 0.05); }

        .no-data { padding: 3rem; text-align: center; color: var(--text-secondary); font-weight: 600; border: 1px dashed var(--border-glass); border-radius: var(--radius-lg); }

        /* Desktop enhancements */
        @media (min-width: 768px) {
          .admin-header { flex-direction: row; justify-content: space-between; align-items: center; gap: 0; }
          .admin-filters { flex-direction: row; align-items: center; }
          .status-select { width: auto; min-width: 180px; }
          .order-card { flex-direction: row; flex-wrap: wrap; align-items: center; padding: 1.5rem 2rem; }
          .order-card-top { flex: 1 0 100%; }
          .order-card-customer { flex: 1; }
          .order-card-meta { flex: 1; }
          .order-card-footer { flex: 0 0 auto; border-top: none; padding-top: 0; }
          .modal-overlay { align-items: center; padding: 20px; }
          .modal-content { border-radius: var(--radius-lg); }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
