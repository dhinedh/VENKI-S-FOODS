import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, CheckCircle2, Clock, Truck, Store, 
  MapPin, Phone, RefreshCw, ChevronLeft, AlertCircle,
  Copy, CheckCheck, MessageCircle, ShoppingBag
} from 'lucide-react';
import api from '../lib/api';
import SEOHead from '../components/SEOHead';

const OrderTrack = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

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
    const interval = setInterval(fetchOrder, 60000);
    return () => clearInterval(interval);
  }, [id]);

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading && !order) {
    return (
      <div className="ot-loading">
        <div className="ot-spinner"/>
        <p>Locating your order{id ? ` #${id.substring(0,8)}` : ''}…</p>
      </div>
    );
  }

  // ── Empty / Error state ────────────────────────────────────────────────
  if (error || !id) {
    return (
      <div className="ot-empty-wrap">
        <SEOHead title="Track Your Order | Venki's Foods" />
        <div className="ot-empty-card">
          <Package size={44} className="ot-empty-icon"/>
          <h1>Track Your <span className="gold">Order</span></h1>
          <p className="ot-empty-desc">Enter your Order ID to see live preparation status.</p>

          <form className="ot-search-form" onSubmit={(e) => {
            e.preventDefault();
            const val = e.target.trackId.value.trim();
            if (val) window.location.href = `/track/${val}`;
          }}>
            <input 
              name="trackId" type="text" 
              placeholder="Paste Order ID here…" 
              className="ot-search-input"
              required
            />
            <button type="submit" className="ot-search-btn">Track</button>
          </form>

          {error && (
            <div className="ot-error-msg">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <Link to="/menu" className="ot-back-link">← Back to Menu</Link>
        </div>

        <style>{`
          .ot-empty-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
          .ot-empty-card { text-align: center; max-width: 420px; width: 100%; padding: 2.5rem 1.5rem; border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; background: rgba(18,18,18,0.8); }
          .ot-empty-icon { color: var(--primary-gold); opacity: 0.5; margin: 0 auto 1.5rem; display: block; }
          .ot-empty-card h1 { font-size: 1.8rem; font-family: var(--font-serif); margin-bottom: 0.5rem; }
          .ot-empty-desc { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem; }
          .ot-search-form { display: flex; gap: 10px; }
          .ot-search-input { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 13px 16px; color: #fff; font-family: inherit; font-size: 0.9rem; outline: none; }
          .ot-search-input:focus { border-color: rgba(212,175,55,0.4); }
          .ot-search-btn { background: var(--primary-gold); color: #000; font-weight: 800; padding: 13px 22px; border-radius: 10px; font-size: 0.9rem; white-space: nowrap; }
          .ot-error-msg { display: flex; align-items: center; gap: 8px; color: #ef4444; font-size: 0.85rem; font-weight: 600; margin-top: 1rem; justify-content: center; }
          .ot-back-link { display: inline-block; margin-top: 2rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; }
          .gold { color: var(--primary-gold); }
        `}</style>
      </div>
    );
  }

  // ── Timeline statuses ──────────────────────────────────────────────────
  const statuses = [
    { key: 'pending',    label: 'Order Placed',  icon: <Package size={18}/> },
    { key: 'confirmed',  label: 'Confirmed',      icon: <CheckCircle2 size={18}/> },
    { key: 'preparing',  label: 'Preparing',      icon: <Clock size={18}/> },
    { 
      key: order.delivery_type === 'delivery' ? 'out_for_delivery' : 'ready_for_pickup', 
      label: order.delivery_type === 'delivery' ? 'On the Way' : 'Ready for Pickup', 
      icon: order.delivery_type === 'delivery' ? <Truck size={18}/> : <Store size={18}/> 
    },
    { key: 'delivered', label: 'Delivered', icon: <CheckCheck size={18}/> }
  ];

  const currentIdx = statuses.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';
  const isUnpaid = order.payment_status === 'unpaid' && !isCancelled;

  const statusColors = {
    pending:          { bg: 'rgba(255,255,255,0.06)', text: '#aaa' },
    confirmed:        { bg: 'rgba(64,196,255,0.12)',  text: '#40c4ff' },
    preparing:        { bg: 'rgba(212,175,55,0.12)',  text: '#D4AF37' },
    out_for_delivery: { bg: 'rgba(212,175,55,0.2)',   text: '#D4AF37' },
    ready_for_pickup: { bg: 'rgba(212,175,55,0.2)',   text: '#D4AF37' },
    delivered:        { bg: 'rgba(16,185,129,0.12)',  text: '#10b981' },
    cancelled:        { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444' },
  };
  const sc = statusColors[order.status] || statusColors.pending;

  return (
    <div className="ot-page">
      <SEOHead title={`Track Order #${order.id.substring(0,8)} | Venki's Foods`} />

      {/* ── Top Bar ── */}
      <div className="ot-topbar">
        <Link to="/orders" className="ot-back">
          <ChevronLeft size={18}/> Orders
        </Link>
        <button className="ot-refresh" onClick={fetchOrder} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''}/>
          {loading ? 'Updating…' : 'Refresh'}
        </button>
      </div>

      {/* ── Order Identity Bar ── */}
      <div className="ot-id-bar">
        <div>
          <p className="ot-id-label">Order ID</p>
          <p className="ot-id-val">#{order.id.substring(0,8).toUpperCase()}</p>
          <p className="ot-id-date">{new Date(order.created_at).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
        </div>
        <span className="ot-status-pill" style={{ background: sc.bg, color: sc.text }}>
          {order.status.replace(/_/g,' ')}
        </span>
      </div>

      {/* ── Payment Action Card (unpaid orders) ── */}
      {isUnpaid && (
        <div className="ot-payment-card">
          <div className="ot-payment-header">
            <AlertCircle size={20} className="ot-payment-icon"/>
            <div>
              <p className="ot-payment-title">Payment Required</p>
              <p className="ot-payment-sub">Amount: <strong>₹{order.total_price}</strong></p>
            </div>
          </div>
          <p className="ot-payment-desc">
            Transfer the amount via UPI or Bank Transfer, then share the screenshot on WhatsApp to confirm your order.
          </p>

          <div className="ot-pay-methods">
            <div className="ot-pay-box">
              <span className="ot-pay-label">UPI ID</span>
              <p className="ot-pay-val">venki@upi</p>
              <button className="ot-copy-btn" onClick={() => copyText('venki@upi', 'upi')}>
                {copied === 'upi' ? <><CheckCheck size={12}/> Copied</> : <><Copy size={12}/> Copy</>}
              </button>
            </div>
            <div className="ot-pay-box">
              <span className="ot-pay-label">Bank Account</span>
              <p className="ot-pay-val">Venki Foods<br/>Acc: 1234567890<br/>IFSC: VENK0001234</p>
              <button className="ot-copy-btn" onClick={() => copyText('1234567890', 'bank')}>
                {copied === 'bank' ? <><CheckCheck size={12}/> Copied</> : <><Copy size={12}/> Copy</>}
              </button>
            </div>
          </div>

          <a 
            href={`https://wa.me/917200883609?text=Namaste!%20I've%20placed%20order%20%23${order.id.substring(0,8)}.%20Sharing%20my%20payment%20screenshot%20for%20%E2%82%B9${order.total_price}.`}
            target="_blank" rel="noopener noreferrer"
            className="ot-whatsapp-btn"
          >
            <MessageCircle size={18}/> Share Payment Screenshot on WhatsApp
          </a>
        </div>
      )}

      {/* ── Status Timeline ── */}
      <div className="ot-section-card">
        <p className="ot-section-title">Order <span className="gold">Status</span></p>

        {isCancelled ? (
          <div className="ot-cancelled">
            <AlertCircle size={28}/>
            <div>
              <p className="ot-cancel-title">Order Cancelled</p>
              <p className="ot-cancel-desc">{order.tracking_note || 'This order was cancelled. Contact support for help.'}</p>
            </div>
          </div>
        ) : (
          <div className="ot-timeline">
            {statuses.map((s, i) => {
              const done = i <= currentIdx;
              const curr = i === currentIdx;
              return (
                <div key={s.key} className={`ot-tl-item ${done ? 'done' : ''} ${curr ? 'curr' : ''}`}>
                  <div className="ot-tl-left">
                    <div className="ot-tl-dot">{s.icon}</div>
                    {i < statuses.length - 1 && <div className="ot-tl-line"/>}
                  </div>
                  <div className="ot-tl-body">
                    <p className="ot-tl-label">{s.label}</p>
                    {curr && order.tracking_note && (
                      <p className="ot-tl-note">{order.tracking_note}</p>
                    )}
                  </div>
                  {curr && <span className="ot-curr-badge">Current</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Delivery Details ── */}
      <div className="ot-section-card">
        <p className="ot-section-title">Delivery <span className="gold">Details</span></p>
        <div className="ot-detail-row">
          <div className="ot-detail-icon"><Store size={16}/></div>
          <div><p className="ot-dl">Type</p><p className="ot-dv">{order.delivery_type.toUpperCase()}</p></div>
        </div>
        <div className="ot-detail-row">
          <div className="ot-detail-icon"><Clock size={16}/></div>
          <div><p className="ot-dl">Time Slot</p><p className="ot-dv">{order.delivery_slot || 'ASAP'}</p></div>
        </div>
        {order.delivery_type === 'delivery' && (
          <div className="ot-detail-row">
            <div className="ot-detail-icon"><MapPin size={16}/></div>
            <div><p className="ot-dl">Address</p><p className="ot-dv">{order.address}</p></div>
          </div>
        )}
      </div>

      {/* ── Order Items ── */}
      <div className="ot-section-card">
        <p className="ot-section-title">Order <span className="gold">Items</span></p>
        <div className="ot-items">
          {order.items.map((item, i) => (
            <div key={i} className="ot-item-row">
              <div className="ot-item-left">
                <ShoppingBag size={14} className="ot-item-icon"/>
                <span className="ot-item-name">{item.name}</span>
                <span className="ot-item-qty">×{item.qty}</span>
              </div>
              <span className="ot-item-price">₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>
        <div className="ot-total-row">
          <span>Grand Total</span>
          <span className="ot-total-val">₹{order.total_price}</span>
        </div>
        <p className="ot-pay-status">
          Payment: <strong style={{ color: order.payment_status === 'paid' ? '#10b981' : '#ef4444' }}>
            {order.payment_status?.toUpperCase() || 'UNPAID'}
          </strong> (Manual Transfer)
        </p>
      </div>

      {/* ── Help ── */}
      <div className="ot-help">
        <a href="https://wa.me/917200883609" target="_blank" rel="noopener noreferrer" className="ot-help-btn">
          <Phone size={16}/> WhatsApp Support
        </a>
        <Link to="/menu" className="ot-help-btn secondary">← Continue Shopping</Link>
      </div>

      <style>{`
        /* ── Page Layout ── */
        .ot-page {
          max-width: 560px;
          margin: 0 auto;
          padding: 70px 1rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* ── Loading ── */
        .ot-loading {
          min-height: 60vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem; color: var(--text-secondary); font-size: 0.9rem;
        }
        .ot-spinner {
          width: 36px; height: 36px;
          border: 2px solid rgba(212,175,55,0.2);
          border-top-color: var(--primary-gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        /* ── Top Bar ── */
        .ot-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        .ot-back {
          display: flex; align-items: center; gap: 4px;
          color: var(--text-secondary); font-size: 0.85rem;
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
          transition: 0.2s;
        }
        .ot-back:hover { color: var(--primary-gold); }
        .ot-refresh {
          display: flex; align-items: center; gap: 6px;
          color: var(--primary-gold); font-weight: 700;
          font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px;
          padding: 8px 14px; border-radius: 8px;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.2);
          transition: 0.2s;
        }
        .ot-refresh:disabled { opacity: 0.5; }

        /* ── ID Bar ── */
        .ot-id-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.1rem 1.25rem;
          background: rgba(18,18,18,0.8);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
        }
        .ot-id-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-secondary); font-weight: 800; margin-bottom: 2px; }
        .ot-id-val { font-size: 1.2rem; font-weight: 900; font-family: monospace; color: #fff; }
        .ot-id-date { font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px; }
        .ot-status-pill {
          padding: 7px 14px; border-radius: 20px;
          font-size: 0.7rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.5px;
          white-space: nowrap;
        }

        /* ── Payment Card ── */
        .ot-payment-card {
          padding: 1.25rem;
          background: rgba(212,175,55,0.04);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
          animation: pulse-border 2s ease infinite;
        }
        @keyframes pulse-border {
          0%,100% { border-color: rgba(212,175,55,0.3); }
          50% { border-color: rgba(212,175,55,0.6); }
        }
        .ot-payment-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 0.75rem; }
        .ot-payment-icon { color: var(--primary-gold); flex-shrink: 0; margin-top: 2px; }
        .ot-payment-title { font-weight: 800; font-size: 1rem; color: #fff; }
        .ot-payment-sub { font-size: 0.85rem; color: var(--text-secondary); }
        .ot-payment-sub strong { color: var(--primary-gold); }
        .ot-payment-desc { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem; }

        .ot-pay-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
        .ot-pay-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 0.9rem;
          position: relative;
        }
        .ot-pay-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); font-weight: 800; display: block; margin-bottom: 4px; }
        .ot-pay-val { font-size: 0.8rem; font-weight: 700; font-family: monospace; color: #fff; line-height: 1.5; padding-right: 2rem; }
        .ot-copy-btn {
          position: absolute; top: 8px; right: 8px;
          display: flex; align-items: center; gap: 3px;
          font-size: 0.6rem; font-weight: 800; color: var(--primary-gold);
          background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2);
          padding: 4px 8px; border-radius: 6px; cursor: pointer; transition: 0.2s;
        }
        .ot-copy-btn:hover { background: rgba(212,175,55,0.2); }
        .ot-whatsapp-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px;
          background: #25D366; color: #fff;
          font-weight: 800; font-size: 0.88rem;
          border-radius: 12px; text-decoration: none; transition: 0.2s;
        }
        .ot-whatsapp-btn:hover { opacity: 0.9; }

        /* ── Section Cards ── */
        .ot-section-card {
          padding: 1.25rem;
          background: rgba(18,18,18,0.8);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
        }
        .ot-section-title {
          font-size: 1rem; font-family: var(--font-serif);
          font-weight: 700; color: #fff; margin-bottom: 1.1rem;
        }
        .gold { color: var(--primary-gold); }

        /* ── Timeline ── */
        .ot-timeline { display: flex; flex-direction: column; gap: 0; }
        .ot-tl-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          position: relative;
        }
        .ot-tl-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
        .ot-tl-dot {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.25);
          transition: 0.4s;
          flex-shrink: 0;
        }
        .ot-tl-line {
          width: 1.5px;
          height: 36px;
          background: rgba(255,255,255,0.07);
          margin: 4px 0;
          transition: 0.4s;
        }
        .ot-tl-item.done .ot-tl-dot {
          background: rgba(16,185,129,0.12);
          border-color: rgba(16,185,129,0.4);
          color: #10b981;
        }
        .ot-tl-item.done .ot-tl-line {
          background: rgba(16,185,129,0.3);
        }
        .ot-tl-item.curr .ot-tl-dot {
          background: rgba(212,175,55,0.12);
          border-color: var(--primary-gold);
          color: var(--primary-gold);
          box-shadow: 0 0 14px rgba(212,175,55,0.25);
        }
        .ot-tl-body {
          padding: 8px 0 28px;
          flex: 1;
        }
        .ot-tl-label {
          font-size: 0.95rem; font-weight: 700;
          color: rgba(255,255,255,0.3);
          transition: 0.3s;
        }
        .ot-tl-item.done .ot-tl-label,
        .ot-tl-item.curr .ot-tl-label { color: #fff; }
        .ot-tl-note {
          font-size: 0.78rem; color: var(--primary-gold);
          font-weight: 600; font-style: italic; margin-top: 4px;
        }
        .ot-curr-badge {
          font-size: 0.6rem; font-weight: 800;
          background: rgba(212,175,55,0.12);
          color: var(--primary-gold);
          border: 1px solid rgba(212,175,55,0.25);
          padding: 3px 10px; border-radius: 20px;
          white-space: nowrap; align-self: center;
          margin-top: 8px;
        }

        /* ── Cancelled ── */
        .ot-cancelled {
          display: flex; gap: 14px; align-items: flex-start;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 12px; padding: 1.1rem;
          color: #ef4444;
        }
        .ot-cancel-title { font-weight: 800; font-size: 1rem; margin-bottom: 4px; }
        .ot-cancel-desc { font-size: 0.82rem; opacity: 0.8; line-height: 1.5; }

        /* ── Detail Rows ── */
        .ot-detail-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 0.85rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ot-detail-row:last-child { border-bottom: none; }
        .ot-detail-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.1);
          display: flex; align-items: center; justify-content: center;
          color: var(--primary-gold); flex-shrink: 0;
        }
        .ot-dl { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); font-weight: 800; margin-bottom: 2px; }
        .ot-dv { font-size: 0.92rem; font-weight: 700; color: #fff; }

        /* ── Items ── */
        .ot-items { margin-bottom: 1rem; }
        .ot-item-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.65rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .ot-item-row:last-child { border-bottom: none; }
        .ot-item-left { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
        .ot-item-icon { color: var(--primary-gold); flex-shrink: 0; }
        .ot-item-name { font-size: 0.88rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ot-item-qty { font-size: 0.78rem; color: var(--text-secondary); font-weight: 600; flex-shrink: 0; margin-left: 4px; }
        .ot-item-price { font-size: 0.88rem; font-weight: 800; color: var(--primary-gold); flex-shrink: 0; }
        .ot-total-row {
          display: flex; justify-content: space-between;
          padding: 0.85rem 0 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-weight: 800; font-size: 1rem; color: #fff;
        }
        .ot-total-val { color: var(--primary-gold); font-size: 1.1rem; }
        .ot-pay-status { font-size: 0.75rem; color: var(--text-secondary); margin-top: 6px; }

        /* ── Help ── */
        .ot-help { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .ot-help-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px; border-radius: 12px;
          font-weight: 700; font-size: 0.85rem;
          text-decoration: none; transition: 0.2s;
          background: #25D366; color: #fff;
          min-width: 140px;
        }
        .ot-help-btn.secondary {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-secondary);
        }

        /* ── Desktop ── */
        @media (min-width: 768px) {
          .ot-page { padding: 100px 2rem 3rem; max-width: 680px; }
          .ot-pay-methods { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
};

export default OrderTrack;
