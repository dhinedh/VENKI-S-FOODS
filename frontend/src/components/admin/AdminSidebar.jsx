import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, 
  RefreshCcw, Star, LogOut, ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('admin_bypass_token');
        localStorage.removeItem('user_role');
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/admin/dashboard' },
        { name: 'Product Catalog', icon: <Package size={20}/>, path: '/admin/products' },
        { name: 'Order Management', icon: <ShoppingBag size={20}/>, path: '/admin/orders' },
        { name: 'Stock & Inventory', icon: <RefreshCcw size={20}/>, path: '/admin/stock' },
        { name: 'Customer Reviews', icon: <Star size={20}/>, path: '/admin/reviews' },
    ];

    return (
        <aside className="admin-sidebar glass-card">
            <div className="sidebar-header">
                <Link to="/" className="back-link">
                    <ArrowLeft size={16} /> Back to Store
                </Link>
                <div className="admin-brand mt-6">
                    <h2>VENKI'S <span className="gold-text">ADMIN</span></h2>
                    <p>Management Suite v1.0</p>
                </div>
            </div>

            <nav className="sidebar-nav mt-10">
                {menuItems.map((item) => (
                    <NavLink 
                        key={item.path} 
                        to={item.path} 
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.name}</span>
                        <ChevronRight className="arrow" size={14} />
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer mt-auto">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>

            <style>{`
                .admin-sidebar {
                    width: 280px;
                    height: calc(100vh - 40px);
                    margin: 20px;
                    padding: 2.5rem 1.5rem;
                    display: flex;
                    flex-direction: column;
                    position: sticky;
                    top: 20px;
                    background: rgba(10, 10, 10, 0.8);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--border-gold);
                    border-radius: var(--radius-lg);
                }

                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: var(--text-secondary);
                    transition: 0.3s;
                    letter-spacing: 1px;
                }
                .back-link:hover { color: var(--primary-gold); }

                .admin-brand h2 { font-size: 1.4rem; font-family: var(--font-serif); margin: 0; color: #fff; letter-spacing: 1px; }
                .admin-brand p { font-size: 0.6rem; color: var(--text-secondary); letter-spacing: 2px; font-weight: 800; text-transform: uppercase; margin-top: 4px; }

                .sidebar-nav { display: flex; flex-direction: column; gap: 0.8rem; }
                
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                    padding: 14px 18px;
                    border-radius: var(--radius-md);
                    color: rgba(255, 255, 255, 0.6);
                    transition: var(--transition-smooth);
                    position: relative;
                }
                .nav-item .icon { color: rgba(255, 255, 255, 0.4); transition: 0.3s; }
                .nav-item .label { font-size: 0.95rem; font-weight: 500; letter-spacing: 0.5px; }
                .nav-item .arrow { margin-left: auto; opacity: 0; transform: translateX(-10px); transition: 0.3s; }

                .nav-item:hover { background: rgba(212, 175, 55, 0.05); color: #fff; }
                .nav-item:hover .icon { color: var(--primary-gold); }
                .nav-item:hover .arrow { opacity: 0.5; transform: translateX(0); }

                .nav-item.active {
                    background: linear-gradient(90deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.02) 100%);
                    color: var(--primary-gold);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                }
                .nav-item.active .icon { color: var(--primary-gold); filter: drop-shadow(0 0 8px var(--primary-glow)); }
                .nav-item.active .arrow { opacity: 1; transform: translateX(0); color: var(--primary-gold); }


                .logout-btn {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 14px 18px;
                    width: 100%;
                    background: rgba(239, 68, 68, 0.05);
                    border: 1px solid rgba(239, 68, 68, 0.1);
                    border-radius: var(--radius-md);
                    color: #ef4444;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                    transition: 0.3s;
                }
                .logout-btn:hover { background: rgba(239, 68, 68, 0.15); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(239, 68, 68, 0.1); }

                @media (max-width: 1200px) {
                    .admin-sidebar { width: 240px; }
                }

                @media (max-width: 991px) {
                    .admin-sidebar {
                        width: 80px;
                        padding: 2rem 1rem;
                        align-items: center;
                        margin: 10px;
                    }
                    .admin-brand, .back-link, .nav-item .label, .nav-item .arrow, .logout-btn span {
                        display: none;
                    }
                }
            `}</style>
        </aside>
    );
};

export default AdminSidebar;
