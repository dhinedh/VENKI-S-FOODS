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
          <Link to="/admin" className="back-link"><ArrowLeft size={18}/> Back to Dashboard</Link>
          <h1 className="mt-2 text-3xl font-bold">Inventory <span>Control</span></h1>
        </div>
        <div className="search-bar glass-card">
          <Search size={18}/>
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
                <div key={product.id} className={`stock-card glass-card ${isOut ? 'out' : ''}`}>
                  <div className="sc-header">
                    <div className="sc-img">
                       <img src={product.image} alt={product.name} />
                    </div>
                    <div className="sc-title">
                       <h3>{product.name}</h3>
                       <p className="text-secondary text-sm">{product.category}</p>
                    </div>
                  </div>

                  <div className="sc-body mt-6">
                    <div className="qty-label flex justify-between items-center mb-4">
                       <span className="text-secondary font-bold text-sm">CURRENT QUANTITY</span>
                       {isOut ? (
                         <span className="badge out">Out of Stock</span>
                       ) : isLow ? (
                         <span className="badge low">Low Stock</span>
                       ) : (
                         <span className="badge safe">In Stock</span>
                       )}
                    </div>
                    
                    <div className="qty-input-group">
                       <button onClick={() => handleQtyChange(product.id, qty - 1)} disabled={qty <= 0}><Minus size={18}/></button>
                       <input 
                         type="number" 
                         value={qty} 
                         onChange={(e) => handleQtyChange(product.id, e.target.value)}
                       />
                       <button onClick={() => handleQtyChange(product.id, qty + 1)}><Plus size={18}/></button>
                    </div>
                  </div>

                  <div className="sc-footer mt-6">
                    <button 
                      className={`btn btn-full ${updatingId === product.id ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleUpdate(product.id)}
                      disabled={updatingId === product.id}
                    >
                      {updatingId === product.id ? <Loader2 className="animate-spin" /> : <><Save size={18}/> Update Stock</>}
                    </button>
                    {updatingId === null && <p className="text-xs text-secondary mt-2 text-center flex items-center justify-center gap-1"><CheckCircle2 size={12}/> Changes saved locally</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .admin-header h1 span { color: var(--primary-gold); }
        .back-link { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; transition: 0.3s; }
        .back-link:hover { color: var(--primary-gold); }

        .search-bar { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); background: rgba(255, 255, 255, 0.03) !important; flex-direction: row !important; min-width: 320px; }
        .search-bar input { background: none; border: none; color: #fff; font-family: inherit; font-size: 0.95rem; width: 100%; }
        .search-bar input:focus { outline: none; }
        .search-bar svg { color: var(--primary-gold); }

        .stock-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem; }
        .stock-card { padding: 2rem; border: 1px solid var(--border-glass); background: rgba(18, 18, 18, 0.4); border-radius: var(--radius-lg); transition: 0.3s; }
        .stock-card:hover { border-color: var(--border-gold); transform: translateY(-5px); box-shadow: 0 10px 30px rgba(212, 175, 55, 0.05); }
        .stock-card.out { border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.02); }
        
        .sc-header { display: flex; gap: 1.5rem; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1.5rem; }
        .sc-img { width: 54px; height: 54px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-glass); }
        .sc-img img { width: 100%; height: 100%; object-fit: cover; }
        
        .sc-title { flex: 1; min-width: 0; }
        .sc-title h3 { font-size: 1.25rem; font-family: var(--font-serif); color: #fff; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sc-title p { margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: var(--text-secondary); font-size: 0.65rem; }

        .qty-label { font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; color: var(--primary-gold); text-transform: uppercase; }

        .qty-input-group { display: flex; align-items: center; gap: 1rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); padding: 8px; border: 1px solid var(--border-glass); margin-top: 1rem; }
        .qty-input-group button { width: 44px; height: 44px; border-radius: 10px; color: var(--primary-gold); background: rgba(212, 175, 55, 0.05); transition: 0.3s; }
        .qty-input-group button:hover:not(:disabled) { background: rgba(212, 175, 55, 0.15); transform: scale(1.05); }
        .qty-input-group button:disabled { opacity: 0.3; cursor: not-allowed; }
        .qty-input-group input { flex: 1; background: none; border: none; text-align: center; color: #fff; font-weight: 800; font-size: 1.5rem; font-family: var(--font-sans); min-width: 60px; }
        .qty-input-group input:focus { outline: none; }
        .qty-input-group input::-webkit-inner-spin-button { -webkit-appearance: none; }

        .badge { font-size: 0.65rem; padding: 6px 12px; border-radius: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .badge.out { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
        .badge.low { background: rgba(245, 158, 11, 0.1); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.2); }
        .badge.safe { background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.2); }

        .btn-primary { color: #000 !important; font-weight: 800 !important; }
        .btn-full { width: 100%; justify-content: center; }
        
        .sc-footer p { opacity: 0.6; letter-spacing: 0.5px; }

        @media (max-width: 991px) {
           .admin-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
           .search-bar { min-width: 0; width: 100%; }
           .stock-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminStock;
