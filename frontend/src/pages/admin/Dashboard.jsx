import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, ShoppingBag, Clock, Star, 
  ArrowUpRight, ArrowDownRight, RefreshCcw, Package 
} from 'lucide-react';

import api from '../../lib/api';
import SEOHead from '../../components/SEOHead';

/**
 * Dashboard.jsx
 * - Fetch stats from /api/admin/dashboard.
 * - Show: Today's Revenue, Today's Orders, Pending Orders.
 * - Quick shortcuts to Orders, Stock, Reviews.
 */
const Dashboard = () => {
  const [stats, setStats] = useState({ 
    today_orders: 0, 
    pending_orders: 0, 
    today_revenue: 0,
    total_products: 0,
    low_stock_count: 0,
    total_revenue: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error("Dashboard stats failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: "Today's Revenue", 
      value: `₹${stats.today_revenue}`, 
      icon: <TrendingUp size={24}/>, 
      color: 'gold', 
      desc: 'Live revenue for today' 
    },
    { 
      label: "Total Sales", 
      value: `₹${stats.total_revenue}`, 
      icon: <TrendingUp size={24}/>, 
      color: 'gold', 
      desc: 'All-time gross revenue' 
    },
    { 
      label: "Today's Orders", 
      value: stats.today_orders, 
      icon: <ShoppingBag size={24}/>, 
      color: 'blue', 
      desc: 'Total checkouts' 
    },
    { 
      label: "Pending Orders", 
      value: stats.pending_orders, 
      icon: <Clock size={24}/>, 
      color: 'orange', 
      desc: 'Awaiting action',
      alert: stats.pending_orders > 0
    },
    { 
      label: "Catalog Size", 
      value: stats.total_products, 
      icon: <Package size={24}/>, 
      color: 'blue', 
      desc: 'Active heritage products' 
    },
    { 
      label: "Low Stock Items", 
      value: stats.low_stock_count, 
      icon: <RefreshCcw size={24}/>, 
      color: 'orange', 
      desc: 'Items needing restock',
      alert: stats.low_stock_count > 0
    }
  ];


  return (
    <div className="admin-dashboard container section-padding">
      <SEOHead title="Admin Dashboard" />

      <div className="admin-header">
         <div>
           <span className="section-label neon-gold">Management</span>
           <h1 className="text-white">Admin <span className="gold-text">Dashboard</span></h1>
         </div>
         <button className="btn btn-secondary btn-sm" onClick={fetchStats} disabled={loading}>
           <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> 
           Sync Data
         </button>
      </div>

      <div className="stats-grid mt-8">
        {statCards.map((card, i) => (
          <div key={i} className={`stat-card glass-card hover-glow ${card.alert ? 'alert' : ''}`}>
             <div className={`stat-icon ${card.color}`}>{card.icon}</div>
             <div className="stat-info">
               <p className="label">{card.label}</p>
               <h3 className="text-white">{card.value}</h3>
               <p className="desc">{card.desc}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="admin-content-grid mt-10">
        <div className="recent-orders-preview glass-card">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="view-all">View All <ArrowUpRight size={16}/></Link>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* This would ideally be real data from the stats API if expanded */}
                <tr>
                  <td colSpan="4" className="text-center py-10 text-secondary">
                    Detailed order logs available in the Order History section.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="system-health glass-card">
          <div className="card-header">
             <h3>Quick Tips</h3>
          </div>
          <div className="tips-list">
             <div className="tip-item">
               <Package size={20} className="gold-text" />
               <p>Update stock levels daily to prevent overselling.</p>
             </div>
             <div className="tip-item">
               <Star size={20} className="gold-text" />
               <p>Approve customer reviews to build social proof.</p>
             </div>
          </div>
        </div>
      </div>


      <style>{`
        .admin-dashboard { padding: 0 !important; max-width: 1400px; margin: 0 auto; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; }
        .text-white { color: #fff !important; }
        .neon-gold { text-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
        
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .stat-card { padding: 2rem; display: flex; align-items: center; gap: 1.5rem; position: relative; overflow: hidden; border-radius: var(--radius-lg); border: 1px solid var(--border-glass); transition: 0.3s; }
        .stat-card:hover { border-color: var(--border-gold); transform: translateY(-5px); box-shadow: 0 10px 30px rgba(212, 175, 55, 0.05); }
        .stat-card.alert { border-color: var(--error); background: rgba(239, 68, 68, 0.03); }
        
        .stat-icon { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-icon.gold { background: rgba(212, 175, 55, 0.1); color: var(--primary-gold); }
        .stat-icon.blue { background: rgba(64, 196, 255, 0.1); color: #40c4ff; }
        .stat-icon.orange { background: rgba(255, 171, 64, 0.1); color: var(--warning); }
        
        .stat-info .label { font-size: 0.7rem; color: var(--text-secondary); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .stat-info h3 { font-size: 1.8rem; margin: 0; font-family: var(--font-sans); font-weight: 700; }
        .stat-info .desc { font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px; opacity: 0.8; }

        .admin-content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2.5rem; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem; }
        .card-header h3 { font-size: 1.25rem; font-family: var(--font-serif); color: #fff; margin: 0; }
        .view-all { font-size: 0.85rem; color: var(--primary-gold); font-weight: 700; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 1px; }

        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; font-size: 0.75rem; color: var(--text-secondary); padding: 1rem 0; border-bottom: 1px solid var(--border-glass); text-transform: uppercase; letter-spacing: 1px; }
        .admin-table td { padding: 1rem 0; font-size: 0.9rem; color: #eee; }
        
        .tips-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .tip-item { display: flex; gap: 1.2rem; align-items: flex-start; padding: 1rem; border-radius: var(--radius-md); background: rgba(255, 255, 255, 0.02); }
        .tip-item p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 991px) {
          .stats-grid { grid-template-columns: 1fr; gap: 1rem; }
          .admin-content-grid { grid-template-columns: 1fr; }
          .admin-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>

    </div>
  );
};

export default Dashboard;
