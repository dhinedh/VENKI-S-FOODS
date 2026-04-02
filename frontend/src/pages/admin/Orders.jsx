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
          <Link to="/admin" className="back-link"><ArrowLeft size={18}/> Back to Dashboard</Link>
          <h1 className="mt-2 text-3xl font-bold">Manage <span>Orders</span></h1>
        </div>
        <div className="admin-filters">
           <div className="search-bar glass-card">
              <Search size={18}/>
              <input 
                type="text" placeholder="Search ID or Name..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <select 
             className="status-select glass-card"
             value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
           >
             <option value="">All Statuses</option>
             {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
           </select>
        </div>
      </div>

      <main className="orders-table-wrapper mt-10">
        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin" size={48}/></div>
        ) : filteredOrders.length > 0 ? (
          <div className="orders-table">
            <div className="table-row table-header glass-card">
              <span>Date</span>
              <span>Order Details</span>
              <span>Customer</span>
              <span>Total</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {filteredOrders.map(order => (
              <div key={order.id} className="table-row glass-card">
                <div className="col-date">
                  <span className="text-secondary">{new Date(order.created_at).toLocaleDateString()}</span>
                  <p className="text-xs">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="col-id">
                   <strong>#{order.id.substring(0,8)}</strong>
                   <span className="type-tag">{order.delivery_type}</span>
                </div>
                <div className="col-customer">
                   <p className="font-bold">{order.customer_name}</p>
                   <p className="text-xs text-secondary flex items-center gap-1"><Phone size={12}/> {order.customer_phone}</p>
                </div>
                <div className="col-total font-bold text-lg">₹{order.total_price}</div>
                <div className="col-status">
                   <div className={`status-pill ${order.status}`}>{order.status.replace(/_/g, ' ')}</div>
                </div>
                <div className="col-action">
                   <button className="btn btn-secondary btn-sm" onClick={() => {
                     setSelectedOrder(order);
                     setUpdateForm({ status: order.status, tracking_note: order.tracking_note || '' });
                   }}>
                     Update
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
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .admin-header h1 span { color: var(--primary-gold); }
        .back-link { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; transition: 0.3s; }
        .back-link:hover { color: var(--primary-gold); }

        .admin-filters { display: flex; gap: 1.5rem; align-items: center; }
        .search-bar { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); background: rgba(255,255,255,0.03) !important; flex-direction: row !important; min-width: 300px; }
        .search-bar input { background: none; border: none; color: #fff; font-family: inherit; font-size: 0.95rem; width: 100%; }
        .search-bar input:focus { outline: none; }
        .search-bar svg { color: var(--primary-gold); }

        .status-select { background: rgba(255,255,255,0.03) !important; color: #fff; border: 1px solid var(--border-glass) !important; padding: 12px 20px; border-radius: var(--radius-md); font-weight: 600; font-family: inherit; font-size: 0.9rem; cursor: pointer; display: flex !important; flex-direction: row !important; }
        .status-select:focus { outline: none; border-color: var(--primary-gold) !important; }
        
        .orders-table { display: flex; flex-direction: column; gap: 1rem; }
        .table-header { font-weight: 800; color: var(--text-secondary); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1.5px; border-bottom: 1px solid var(--border-glass); padding: 1rem 2rem !important; }
        .table-row { 
          display: grid; grid-template-columns: 0.8fr 1fr 1.2fr 0.8fr 1fr 0.8fr; 
          padding: 1.5rem 2rem; align-items: center; 
          transition: 0.3s;
          border: 1px solid var(--border-glass);
        }
        .table-row:not(.table-header):hover { border-color: var(--border-gold); transform: translateY(-2px); background: rgba(212, 175, 55, 0.02); }
        
        .col-id { display: flex; flex-direction: column; gap: 4px; }
        .col-id strong { color: #fff; font-size: 1rem; }
        .type-tag { font-size: 0.65rem; text-transform: uppercase; color: var(--primary-gold); font-weight: 800; letter-spacing: 1px; }
        
        .col-customer p { margin: 0; }
        .col-total { color: var(--primary-gold); }

        /* Status Pills */
        .status-pill { padding: 6px 12px; border-radius: 20px; font-weight: 800; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; display: inline-block; text-align: center; min-width: 100px; }
        .status-pill.pending { background: rgba(255,255,255,0.1); color: #fff; }
        .status-pill.confirmed { background: rgba(64, 196, 255, 0.1); color: #40c4ff; border: 1px solid rgba(64, 196, 255, 0.2); }
        .status-pill.preparing { background: rgba(245, 158, 11, 0.1); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.2); }
        .status-pill.out_for_delivery, .status-pill.ready_for_pickup { background: rgba(212, 175, 55, 0.1); color: var(--primary-gold); border: 1px solid rgba(212, 175, 55, 0.2); }
        .status-pill.delivered { background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.2); }
        .status-pill.cancelled { background: rgba(239, 68, 68, 0.1); color: var(--error); border: 1px solid rgba(239, 68, 68, 0.2); }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-content { max-width: 500px; width: 100%; padding: 3rem; border: 1px solid var(--border-gold); }
        .modal-header h3 { font-family: var(--font-serif); font-size: 1.5rem; color: #fff; margin: 0; }
        .modal-header button { color: var(--text-secondary); transition: 0.3s; }
        .modal-header button:hover { color: #fff; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
        
        .form-group label { display: block; font-weight: 700; color: var(--primary-gold); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; }
        .form-group select, .form-group textarea { background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 14px; color: #fff; font-family: inherit; width: 100%; transition: 0.3s; }
        .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--primary-gold); background: rgba(212, 175, 55, 0.05); }

        .no-data { padding: 5rem; text-align: center; color: var(--text-secondary); font-weight: 600; border: 1px dashed var(--border-glass); border-radius: var(--radius-lg); }

        @media (max-width: 1200px) {
           .table-row { grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1.5rem; }
           .col-action { grid-column: span 4; display: flex; justify-content: flex-end; }
        }

        @media (max-width: 991px) {
           .admin-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
           .admin-filters { width: 100%; flex-direction: column; align-items: stretch; }
           .search-bar { min-width: 0; }
           .table-header { display: none; }
           .table-row { grid-template-columns: 1fr; gap: 1rem; padding: 1.5rem; }
           .col-action { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
