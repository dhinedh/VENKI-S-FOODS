import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, ShoppingBag, Clock, Star, 
  ArrowUpRight, RefreshCcw, Package, ChevronRight, AlertTriangle
} from 'lucide-react';

import api from '../../lib/api';
import SEOHead from '../../components/SEOHead';

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
      icon: <TrendingUp size={22}/>, 
      color: 'gold', 
      desc: 'Live revenue today',
      link: '/admin/orders'
    },
    { 
      label: "Total Sales", 
      value: `₹${stats.total_revenue}`, 
      icon: <TrendingUp size={22}/>, 
      color: 'gold', 
      desc: 'All-time gross',
      link: '/admin/orders'
    },
    { 
      label: "Today's Orders", 
      value: stats.today_orders, 
      icon: <ShoppingBag size={22}/>, 
      color: 'blue', 
      desc: 'Total checkouts',
      link: '/admin/orders'
    },
    { 
      label: "Pending Orders", 
      value: stats.pending_orders, 
      icon: <Clock size={22}/>, 
      color: 'orange', 
      desc: 'Awaiting action',
      alert: stats.pending_orders > 0,
      link: '/admin/orders'
    },
    { 
      label: "Catalog Size", 
      value: stats.total_products, 
      icon: <Package size={22}/>, 
      color: 'blue', 
      desc: 'Active products',
      link: '/admin/products'
    },
    { 
      label: "Low Stock", 
      value: stats.low_stock_count, 
      icon: <RefreshCcw size={22}/>, 
      color: 'orange', 
      desc: 'Need restock',
      alert: stats.low_stock_count > 0,
      link: '/admin/stock'
    }
  ];

  const quickActions = [
    { label: 'View All Orders', icon: <ShoppingBag size={20}/>, path: '/admin/orders', color: 'blue' },
    { label: 'Manage Products', icon: <Package size={20}/>, path: '/admin/products', color: 'gold' },
    { label: 'Update Stock', icon: <RefreshCcw size={20}/>, path: '/admin/stock', color: 'orange' },
    { label: 'Moderate Reviews', icon: <Star size={20}/>, path: '/admin/reviews', color: 'gold' },
  ];


  return (
    <div className="admin-dashboard">
      <SEOHead title="Admin Dashboard" />

      {/* Header */}
      <div className="dash-header">
        <div>
          <span className="section-label">Management</span>
          <h1>Admin <span className="gold-text">Dashboard</span></h1>
        </div>
        <button className="sync-btn" onClick={fetchStats} disabled={loading}>
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Syncing…' : 'Sync Data'}
        </button>
      </div>

      {/* Alert Banner if pending orders */}
      {stats.pending_orders > 0 && (
        <Link to="/admin/orders" className="alert-banner">
          <AlertTriangle size={18}/>
          <span>{stats.pending_orders} order{stats.pending_orders > 1 ? 's' : ''} pending — tap to review</span>
          <ChevronRight size={16} className="ml-auto"/>
        </Link>
      )}

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <Link key={i} to={card.link} className={`stat-card ${card.alert ? 'alert' : ''}`}>
            <div className={`stat-icon ${card.color}`}>{card.icon}</div>
            <div className="stat-info">
              <p className="label">{card.label}</p>
              <h3>{loading ? '…' : card.value}</h3>
              <p className="desc">{card.desc}</p>
            </div>
            {card.alert && <div className="alert-dot"/>}
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick <span className="gold-text">Actions</span></h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.path} className={`quick-action-card qa-${action.color}`}>
              <span className={`qa-icon qa-icon-${action.color}`}>{action.icon}</span>
              <span className="qa-label">{action.label}</span>
              <ArrowUpRight size={16} className="qa-arrow"/>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .admin-dashboard { padding-bottom: 2rem; }

        /* Header */
        .dash-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
        .dash-header h1 { font-size: 1.8rem; margin: 0.25rem 0 0; }
        .dash-header .section-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--primary-gold); opacity: 0.8; }
        .gold-text { color: var(--primary-gold); }

        .sync-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: var(--radius-md);
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary); font-weight: 700; font-size: 0.8rem;
          text-transform: uppercase; letter-spacing: 1px; transition: 0.3s;
          flex-shrink: 0;
        }
        .sync-btn:hover { border-color: var(--primary-gold); color: var(--primary-gold); }
        .sync-btn:disabled { opacity: 0.5; }

        /* Alert banner */
        .alert-banner {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px; border-radius: var(--radius-md);
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444; font-weight: 700; font-size: 0.9rem;
          margin-bottom: 1.25rem; text-decoration: none; transition: 0.3s;
          animation: pulse-border 2s infinite;
        }
        .alert-banner:hover { background: rgba(239, 68, 68, 0.15); }
        .ml-auto { margin-left: auto; }

        @keyframes pulse-border {
          0%, 100% { border-color: rgba(239,68,68,0.3); }
          50% { border-color: rgba(239,68,68,0.7); }
        }

        /* Stat Cards — 2-col mobile-first */
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1.5rem; }
        .stat-card {
          display: flex; flex-direction: column; gap: 0.75rem;
          padding: 1.1rem; border-radius: var(--radius-lg);
          background: rgba(18,18,18,0.6);
          border: 1px solid rgba(255,255,255,0.06);
          transition: 0.3s; text-decoration: none; position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(212,175,55,0.03) 0%, transparent 60%);
          opacity: 0; transition: 0.3s;
        }
        .stat-card:hover { border-color: rgba(212,175,55,0.25); transform: translateY(-2px); }
        .stat-card:hover::before { opacity: 1; }
        .stat-card.alert { border-color: rgba(239,68,68,0.35); background: rgba(239,68,68,0.04); }
        .stat-card.alert:hover { border-color: rgba(239,68,68,0.6); }

        .alert-dot {
          position: absolute; top: 12px; right: 12px;
          width: 8px; height: 8px; border-radius: 50%;
          background: #ef4444; box-shadow: 0 0 8px #ef4444;
          animation: blink 1.5s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .stat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-icon.gold { background: rgba(212,175,55,0.12); color: var(--primary-gold); }
        .stat-icon.blue { background: rgba(64,196,255,0.12); color: #40c4ff; }
        .stat-icon.orange { background: rgba(255,171,64,0.12); color: var(--warning); }

        .stat-info .label { font-size: 0.6rem; color: var(--text-secondary); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 2px; }
        .stat-info h3 { font-size: 1.6rem; margin: 0; font-family: var(--font-sans); font-weight: 800; color: #fff; line-height: 1; }
        .stat-info .desc { font-size: 0.65rem; color: rgba(255,255,255,0.35); margin: 4px 0 0; }

        /* Quick Actions */
        .section-title { font-size: 1.2rem; font-family: var(--font-serif); margin: 0 0 0.75rem; color: #fff; }
        .quick-actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        .quick-action-card {
          display: flex; align-items: center; gap: 10px;
          padding: 14px; border-radius: var(--radius-md);
          background: rgba(18,18,18,0.6);
          border: 1px solid rgba(255,255,255,0.06);
          text-decoration: none; color: #fff; font-weight: 700; font-size: 0.85rem;
          transition: 0.3s; position: relative; overflow: hidden;
        }
        .quick-action-card:hover { transform: translateY(-2px); }
        .qa-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .qa-icon-gold { background: rgba(212,175,55,0.12); color: var(--primary-gold); }
        .qa-icon-blue { background: rgba(64,196,255,0.12); color: #40c4ff; }
        .qa-icon-orange { background: rgba(255,171,64,0.12); color: var(--warning); }
        .qa-gold:hover { border-color: rgba(212,175,55,0.3); }
        .qa-blue:hover { border-color: rgba(64,196,255,0.3); }
        .qa-orange:hover { border-color: rgba(255,171,64,0.3); }
        .qa-label { flex: 1; font-size: 0.8rem; font-weight: 700; }
        .qa-arrow { color: rgba(255,255,255,0.3); flex-shrink: 0; }

        /* Desktop: 3-col stats */
        @media (min-width: 768px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
          .stat-card { flex-direction: row; align-items: center; gap: 1.25rem; padding: 1.5rem; }
          .stat-info h3 { font-size: 1.9rem; }
          .quick-actions-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
          .quick-action-card { padding: 1.25rem; flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .qa-arrow { position: absolute; top: 14px; right: 14px; }
          .dash-header h1 { font-size: 2.2rem; }
          .section-title { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
