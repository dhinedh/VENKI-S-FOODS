import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, 
  ArrowLeft, Loader2, Image as ImageIcon, 
  CheckCircle, AlertCircle, X, Save
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import SEOHead from '../../components/SEOHead';

/**
 * ProductManager.jsx (Admin)
 * - List all products from Supabase API.
 * - Add new product (with image upload).
 * - Edit existing product.
 * - Delete product.
 */
const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Veg',
        price: '',
        weight: '250g',
        description: '',
        is_veg: true,
        tags: '',
        imageFile: null
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (err) {
            console.error("Failed to load products:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            weight: product.weight || '250g',
            description: product.description || '',
            is_veg: product.is_veg,
            tags: product.tags?.join(', ') || '',
            imageFile: null
        });
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            category: 'Veg',
            price: '',
            weight: '250g',
            description: '',
            is_veg: true,
            tags: '',
            imageFile: null
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'imageFile' && formData[key]) {
                    data.append('image', formData[key]);
                } else if (key === 'tags') {
                    const tagArray = formData[key].split(',').map(s => s.trim()).filter(Boolean);
                    tagArray.forEach(t => data.append('tags', t));
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (editingProduct) {
                await api.patch(`/products/${editingProduct.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            alert("Action failed: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="product-manager container section-padding">
            <SEOHead title="Admin | Product Catalog" />
            
            <div className="admin-header">
                <div>
                    <Link to="/admin" className="back-link"><ArrowLeft size={16}/> Dashboard</Link>
                    <h1 className="mt-2">Product <span>Catalog</span></h1>
                </div>
                <div className="header-controls">
                    <div className="pm-search-bar">
                        <Search size={18} className="search-icon"/>
                        <input 
                            type="text" placeholder="Search products..." 
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary add-btn" onClick={handleAddNew}>
                        <Plus size={18}/> Add Product
                    </button>
                </div>
            </div>

            <main className="mt-10">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={48}/></div>
                ) : (
                    <div className="product-table-wrapper glass-card overflow-hidden">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Weight</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="table-img">
                                                <img src={p.image} alt={p.name} onError={(e) => e.target.src = 'https://via.placeholder.com/50'}/>
                                            </div>
                                        </td>
                                        <td><strong>{p.name}</strong></td>
                                        <td><span className="badge">{p.category}</span></td>
                                        <td>₹{p.price}</td>
                                        <td>{p.weight}</td>
                                        <td className="actions">
                                            <button onClick={() => handleEdit(p)} className="action-btn edit"><Edit size={16}/></button>
                                            <button onClick={() => handleDelete(p.id)} className="action-btn delete"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Editor Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card anim-slide-in">
                        <div className="modal-header">
                            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                            <button onClick={() => setShowModal(false)}><X/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Product Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                        <option>Veg</option>
                                        <option>Non-Veg</option>
                                        <option>Classic</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Weight</label>
                                    <input type="text" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Tags (Comma separated)</label>
                                <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="spicy, heritage, organic" />
                            </div>
                            <div className="form-group">
                                <label>Product Image {editingProduct && '(Leave blank to keep current)'}</label>
                                <div className="file-input glass-card">
                                    <ImageIcon size={18}/>
                                    <input type="file" onChange={e => setFormData({...formData, imageFile: e.target.files[0]})} />
                                </div>
                            </div>
                            <div className="modal-actions mt-8">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="animate-spin"/> : <><Save size={18}/> Save Product</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                /* Mobile-first */
                .admin-header { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
                .admin-header h1 { font-size: 1.6rem; }
                .admin-header h1 span { color: var(--primary-gold); }
                .back-link { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; }
                .back-link:hover { color: var(--primary-gold); }

                /* Fixed search bar — explicit row layout to beat glass-card override */
                .header-controls { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
                .pm-search-bar {
                    display: flex !important; flex-direction: row !important;
                    align-items: center; gap: 12px; padding: 13px 16px;
                    border-radius: var(--radius-md); border: 1px solid var(--border-glass);
                    background: rgba(255,255,255,0.04);
                    transition: 0.3s;
                }
                .pm-search-bar:focus-within { border-color: rgba(212,175,55,0.4); background: rgba(212,175,55,0.03); }
                .pm-search-bar .search-icon { color: var(--primary-gold); flex-shrink: 0; }
                .pm-search-bar input { background: none; border: none; color: #fff; font-family: inherit; font-size: 0.95rem; width: 100%; outline: none; }
                .pm-search-bar input::placeholder { color: rgba(255,255,255,0.3); }
                .add-btn { width: 100%; justify-content: center; }

                /* Accessibility Fix: Gold buttons need dark text for contrast */
                .btn-primary { color: #000 !important; font-weight: 800 !important; }
                
                .product-table-wrapper { border-radius: var(--radius-lg); border: 1px solid var(--border-glass); background: rgba(18, 18, 18, 0.4); overflow-x: auto; -webkit-overflow-scrolling: touch; }
                .admin-table { width: 100%; border-collapse: collapse; min-width: 500px; }
                .admin-table th { text-align: left; padding: 1rem; border-bottom: 1px solid var(--border-glass); color: var(--text-secondary); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1.5px; font-weight: 800; white-space: nowrap; }
                .admin-table td { padding: 1rem; border-bottom: 1px solid var(--border-glass); font-size: 0.9rem; color: #eee; }
                .admin-table tr:last-child td { border-bottom: none; }
                .admin-table tr:hover { background: rgba(212, 175, 55, 0.02); }
                .admin-table td strong { color: #fff; display: block; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                .table-img { width: 44px; height: 44px; border-radius: 10px; overflow: hidden; border: 1px solid var(--border-glass); }
                .table-img img { width: 100%; height: 100%; object-fit: cover; }
                
                .badge { background: rgba(212, 175, 55, 0.1); color: var(--primary-gold); padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 0.6rem; border: 1px solid rgba(212, 175, 55, 0.2); text-transform: uppercase; letter-spacing: 0.5px; }
                
                .actions { display: flex; gap: 10px; }
                .action-btn { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: 0.3s; border: 1px solid transparent; }
                .action-btn.edit { background: rgba(64,196,255,0.1); color: #40c4ff; }
                .action-btn.edit:hover { border-color: rgba(64,196,255,0.3); }
                .action-btn.delete { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                .action-btn.delete:hover { border-color: rgba(239, 68, 68, 0.3); }
                
                /* Modal: bottom sheet on mobile */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 4000; display: flex; align-items: flex-end; justify-content: center; padding: 0; }
                .modal-content { max-width: 700px; width: 100%; padding: 2rem 1.5rem; border: 1px solid var(--border-gold); border-radius: var(--radius-lg) var(--radius-lg) 0 0; max-height: 90vh; overflow-y: auto; }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .modal-header h3 { font-family: var(--font-serif); font-size: 1.4rem; color: #fff; margin:0; }
                .modal-header button { color: var(--text-secondary); transition: 0.3s; padding: 8px; }
                .modal-header button:hover { color: #fff; }
                
                .admin-form .form-row { display: flex; flex-direction: column; gap: 0; }
                .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.25rem; }
                .form-group label { font-size: 0.75rem; font-weight: 800; color: var(--primary-gold); text-transform: uppercase; letter-spacing: 1px; }
                .form-group input, .form-group select, .form-group textarea { background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 14px; color: #fff; font-family: inherit; transition: 0.3s; }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--primary-gold); background: rgba(212, 175, 55, 0.05); }
                
                .file-input { display: flex; align-items: center; gap: 1rem; padding: 14px; position: relative; border-radius: var(--radius-md); cursor: pointer; transition: 0.3s; border: 1px solid var(--border-glass); }
                .file-input:hover { border-color: var(--primary-gold); background: rgba(212, 175, 55, 0.05); }
                .file-input input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
                .file-input svg { color: var(--primary-gold); }
                
                /* Full-width buttons in modal on mobile */
                .modal-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
                .modal-actions button { flex: 1; padding: 14px; }

                /* Desktop enhancements */
                @media (min-width: 768px) {
                  .admin-header { flex-direction: row; justify-content: space-between; align-items: center; gap: 0; }
                  .header-controls { flex-direction: row; width: auto; gap: 1.5rem; align-items: center; }
                  .add-btn { width: auto; }
                  .pm-search-bar { min-width: 260px; }
                  .admin-form .form-row { flex-direction: row; gap: 1.5rem; }
                  .modal-overlay { align-items: center; padding: 20px; }
                  .modal-content { border-radius: var(--radius-lg); padding: 3rem; max-height: none; }
                  .modal-actions { justify-content: flex-end; }
                  .modal-actions button { flex: none; }
                }
            `}</style>
        </div>
    );
};

export default ProductManager;
