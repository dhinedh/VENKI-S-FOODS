import React, { useState, useEffect } from 'react';
import { 
  Plus, Minus, Save, ArrowLeft, 
  Search, Package, AlertCircle, Loader2, CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import productsData from '../../data/products.json';
import api from '../../lib/api';
import SEOHead from '../../components/SEOHead';

const AdminStock = () => {
  // Mock First Initialization
  const [products, setProducts] = useState(productsData);
  const [stockLevels, setStockLevels] = useState({});

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products
      const { data: prodData } = await api.get('/products');
      if (prodData && prodData.length > 0) setProducts(prodData);

      // 2. Fetch Stock
      const { data: stockData } = await api.get('/stock');
      const stockMap = stockData.reduce((acc, item) => {
        acc[item.product_id] = item.quantity;
        return acc;
      }, {});
      setStockLevels(stockMap);
    } catch (err) {
      console.warn("Stock: Using partial/static data fallback.", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleUpdate = async (productId) => {
    setUpdatingId(productId);
    try {
      const qty = stockLevels[productId] || 0;
      await api.patch(`/admin/stock/${productId}`, { quantity: qty });
      // Local success feedback
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleQtyChange = (productId, val) => {
    setStockLevels({ ...stockLevels, [productId]: parseInt(val) || 0 });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-stock container section-padding">
      <SEOHead title="Admin | Stock Inventory" />

      <div className="admin-header">
        <div>
          <Link to="/admin" className="back-link"><ArrowLeft size={16}/> Dashboard</Link>
          <h1 className="mt-2">Inventory <span>Control</span></h1>
        </div>
        <div className="adm-search">
          <Search size={18} className="srch-icon"/>
          <input 
            type="text" placeholder="Search products..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <main className="stock-list mt-10">
        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin" size={48}/></div>
        ) : (
          <div className="stock-grid">
            {filteredProducts.map(product => {
              const qty = stockLevels[product.id] || 0;
              const isLow = qty <= 5;
              const isOut = qty === 0;

              return (
                <div key={product.id} className={`stock-card ${isOut ? 'out' : ''}`}>
                  <div className="sc-header">
                    <div className="sc-img">
                       <img src={product.image} alt={product.name} />
                    </div>
                    <div className="sc-title">
                       <h3>{product.name}</h3>
                       <p>{product.category}</p>
                    </div>
                    {/* Badge in header for quick scan */}
                    {isOut ? (
                      <span className="badge out">Out</span>
                    ) : isLow ? (
                      <span className="badge low">Low</span>
                    ) : (
                      <span className="badge safe">In Stock</span>
                    )}
                  </div>

                  <div className="sc-body">
                    <p className="qty-label-text">STOCK QUANTITY</p>
                    {/* Qty stepper — explicit flex row, no glass-card */}
                    <div className="qty-stepper">
                       <button 
                         className="qty-btn" 
                         onClick={() => handleQtyChange(product.id, qty - 1)} 
                         disabled={qty <= 0}
                       >
                         <Minus size={20}/>
                       </button>
                       <span className="qty-value">{qty}</span>
                       <button 
                         className="qty-btn"
                         onClick={() => handleQtyChange(product.id, qty + 1)}
                       >
                         <Plus size={20}/>
                       </button>
                    </div>
                    <input 
                      type="number" 
                      value={qty} 
                      onChange={(e) => handleQtyChange(product.id, e.target.value)}
                      className="qty-direct-input"
                      placeholder="Or type qty..."
                    />
                  </div>

                  <div className="sc-footer">
                    <button 
                      className={`sc-update-btn ${updatingId === product.id ? 'updating' : ''}`}
                      onClick={() => handleUpdate(product.id)}
                      disabled={updatingId === product.id}
                    >
                      {updatingId === product.id 
                        ? <><Loader2 className="animate-spin" size={18}/> Saving…</> 
                        : <><Save size={18}/> Update Stock</>
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        /* Mobile-first */
        .admin-header { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
        .admin-header h1 { font-size: 1.6rem; }
        .admin-header h1 span { color: var(--primary-gold); }
        .back-link { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; transition: 0.3s; }
        .back-link:hover { color: var(--primary-gold); }

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

        /* Stock cards — no glass-card to avoid overflow:hidden */
        .stock-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .stock-card {
            padding: 1.25rem;
            border: 1px solid rgba(255,255,255,0.07);
            background: rgba(18,18,18,0.7);
            border-radius: var(--radius-lg);
            transition: 0.3s;
        }
        .stock-card:hover { border-color: rgba(212,175,55,0.25); }
        .stock-card.out { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.03); }

        .sc-header { display: flex; align-items: center; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .sc-img { width: 50px; height: 50px; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
        .sc-img img { width: 100%; height: 100%; object-fit: cover; }
        .sc-title { flex: 1; min-width: 0; }
        .sc-title h3 { font-size: 1.05rem; font-family: var(--font-serif); color: #fff; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sc-title p { margin: 2px 0 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.6rem; font-weight: 800; color: var(--text-secondary); }

        .sc-body { padding: 1rem 0; }
        .qty-label-text { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--primary-gold); margin: 0 0 0.75rem; opacity: 0.85; }

        /* The stepper: pure flex row, no glass-card */
        .qty-stepper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: var(--radius-md);
            padding: 4px;
            margin-bottom: 0.75rem;
        }
        .qty-btn {
            width: 48px; height: 48px;
            border-radius: 10px;
            background: rgba(212,175,55,0.08);
            color: var(--primary-gold);
            display: flex; align-items: center; justify-content: center;
            transition: 0.2s; flex-shrink: 0;
        }
        .qty-btn:hover:not(:disabled) { background: rgba(212,175,55,0.18); }
        .qty-btn:disabled { opacity: 0.25; cursor: not-allowed; }
        .qty-value {
            font-size: 2rem; font-weight: 900;
            font-family: var(--font-sans);
            color: #fff; text-align: center;
            flex: 1; line-height: 1;
        }
        .qty-direct-input {
            width: 100%; background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: var(--radius-md);
            padding: 10px 14px; color: rgba(255,255,255,0.5);
            font-family: inherit; font-size: 0.85rem;
            text-align: center; outline: none; transition: 0.3s;
        }
        .qty-direct-input:focus { border-color: rgba(212,175,55,0.4); color: #fff; }
        .qty-direct-input::-webkit-inner-spin-button { -webkit-appearance: none; }

        .sc-footer { padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .sc-update-btn {
            width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
            padding: 14px; border-radius: var(--radius-md);
            background: linear-gradient(135deg, var(--primary-gold), #c8a415);
            color: #000; font-weight: 800; font-size: 0.9rem;
            text-transform: uppercase; letter-spacing: 1px;
            transition: 0.3s;
        }
        .sc-update-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .sc-update-btn.updating { opacity: 0.6; cursor: not-allowed; }

        .badge { font-size: 0.6rem; padding: 4px 10px; border-radius: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; flex-shrink: 0; }
        .badge.out { background: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
        .badge.low { background: rgba(245,158,11,0.12); color: var(--warning); border: 1px solid rgba(245,158,11,0.2); }
        .badge.safe { background: rgba(16,185,129,0.12); color: var(--success); border: 1px solid rgba(16,185,129,0.2); }

        /* Desktop enhancements */
        @media (min-width: 640px) {
          .stock-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        }
        @media (min-width: 1024px) {
          .stock-grid { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
          .admin-header { flex-direction: row; justify-content: space-between; align-items: center; }
          .stock-card { padding: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default AdminStock;
