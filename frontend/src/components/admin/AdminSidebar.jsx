import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, 
  RefreshCcw, Star, LogOut, ArrowLeft,
  ChevronRight, Menu as MenuIcon, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('admin_bypass_token');
        localStorage.removeItem('user_role');
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={22}/>, path: '/admin/dashboard' },
        { name: 'Products', icon: <Package size={22}/>, path: '/admin/products' },
        { name: 'Orders', icon: <ShoppingBag size={22}/>, path: '/admin/orders' },
        { name: 'Stock', icon: <RefreshCcw size={22}/>, path: '/admin/stock' },
        { name: 'Reviews', icon: <Star size={22}/>, path: '/admin/reviews' },
    ];

    return (
        <>
            {/* ── DESKTOP SIDEBAR (hidden on mobile) ── */}
            <aside className="admin-sidebar glass-card desktop-sidebar">
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
            </aside>

            {/* ── MOBILE TOP BAR (hidden on desktop) ── */}
            <header className="mobile-admin-topbar">
                <Link to="/" className="mobile-store-link">
                    <ArrowLeft size={16} /> Store
                </Link>
                <span className="mobile-brand">VENKI'S <span className="gold-text">ADMIN</span></span>
                <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
                    <MenuIcon size={22} />
                </button>
            </header>

            {/* ── MOBILE DRAWER MENU ── */}
            {mobileMenuOpen && (
                <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-drawer glass-card" onClick={e => e.stopPropagation()}>
                        <div className="drawer-header">
                            <div className="admin-brand">
                                <h2>VENKI'S <span className="gold-text">ADMIN</span></h2>
                                <p>Management Suite v1.0</p>
                            </div>
                            <button className="drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                                <X size={22} />
                            </button>
                        </div>

                        <nav className="drawer-nav">
                            {menuItems.map((item) => (
                                <NavLink 
                                    key={item.path} 
                                    to={item.path} 
                                    className={({ isActive }) => `drawer-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="icon">{item.icon}</span>
                                    <span className="label">{item.name}</span>
                                    <ChevronRight className="arrow" size={16} />
                                </NavLink>
                            ))}
                        </nav>

                        <button onClick={handleLogout} className="drawer-logout">
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>

                        <Link to="/" className="drawer-store-link">
                            <ArrowLeft size={14} /> Back to Store
                        </Link>
                    </div>
                </div>
            )}

            {/* ── MOBILE BOTTOM NAV BAR ── */}
            <nav className="mobile-bottom-nav">
                {menuItems.map((item) => (
                    <NavLink 
                        key={item.path} 
                        to={item.path} 
                        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="bn-icon">{item.icon}</span>
                        <span className="bn-label">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <style>{`
                /* ── DESKTOP SIDEBAR ── */
                .desktop-sidebar {
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
                .gold-text { color: var(--primary-gold); }

                .sidebar-nav { display: flex; flex-direction: column; gap: 0.8rem; }
                .nav-item {
                    display: flex; align-items: center; gap: 1.2rem;
                    padding: 14px 18px; border-radius: var(--radius-md);
                    color: rgba(255, 255, 255, 0.6);
                    transition: var(--transition-smooth); position: relative;
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
                    margin-top: auto; display: flex; align-items: center; gap: 1rem;
                    padding: 14px 18px; width: 100%;
                    background: rgba(239, 68, 68, 0.05);
                    border: 1px solid rgba(239, 68, 68, 0.1);
                    border-radius: var(--radius-md); color: #ef4444;
                    font-weight: 700; text-transform: uppercase; font-size: 0.8rem;
                    letter-spacing: 1px; transition: 0.3s;
                }
                .logout-btn:hover { background: rgba(239, 68, 68, 0.15); }

                /* ── MOBILE TOP BAR ── */
                .mobile-admin-topbar {
                    display: none;
                    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--border-gold);
                    padding: 12px 16px;
                    align-items: center;
                    justify-content: space-between;
                }
                .mobile-store-link {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
                    color: var(--text-secondary); letter-spacing: 1px;
                }
                .mobile-brand {
                    font-family: var(--font-serif); font-size: 1rem;
                    font-weight: 700; color: #fff; letter-spacing: 1px;
                }
                .mobile-hamburger {
                    color: var(--primary-gold); padding: 6px;
                    border-radius: 8px; background: rgba(212, 175, 55, 0.1);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                }

                /* ── DRAWER ── */
                .mobile-drawer-overlay {
                    position: fixed; inset: 0; z-index: 500;
                    background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
                }
                .mobile-drawer {
                    position: absolute; top: 0; right: 0;
                    width: 85%; max-width: 320px; height: 100%;
                    background: rgba(10,10,10,0.97);
                    border-left: 1px solid var(--border-gold);
                    padding: 2rem 1.5rem;
                    display: flex; flex-direction: column; gap: 1.5rem;
                    overflow-y: auto;
                }
                .drawer-header {
                    display: flex; justify-content: space-between; align-items: flex-start;
                    padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass);
                }
                .drawer-close {
                    color: var(--text-secondary); padding: 6px;
                    border-radius: 8px; flex-shrink: 0;
                }
                .drawer-nav { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
                .drawer-item {
                    display: flex; align-items: center; gap: 1rem;
                    padding: 16px 14px; border-radius: var(--radius-md);
                    color: rgba(255,255,255,0.6); transition: 0.2s;
                    font-size: 1rem; font-weight: 500;
                }
                .drawer-item .icon { color: rgba(255,255,255,0.4); }
                .drawer-item .arrow { margin-left: auto; opacity: 0; }
                .drawer-item:hover { background: rgba(212,175,55,0.05); color: #fff; }
                .drawer-item:hover .icon { color: var(--primary-gold); }
                .drawer-item.active {
                    background: linear-gradient(90deg, rgba(212,175,55,0.15), rgba(212,175,55,0.02));
                    color: var(--primary-gold); border: 1px solid rgba(212,175,55,0.2);
                }
                .drawer-item.active .icon { color: var(--primary-gold); }
                .drawer-item.active .arrow { opacity: 1; color: var(--primary-gold); }
                .drawer-logout {
                    display: flex; align-items: center; gap: 1rem;
                    padding: 14px; width: 100%;
                    background: rgba(239,68,68,0.05);
                    border: 1px solid rgba(239,68,68,0.1);
                    border-radius: var(--radius-md); color: #ef4444;
                    font-weight: 700; font-size: 0.9rem;
                }
                .drawer-store-link {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
                    color: var(--text-secondary); letter-spacing: 1px;
                    padding: 8px 0;
                }

                /* ── MOBILE BOTTOM NAV ── */
                .mobile-bottom-nav {
                    display: none;
                    position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
                    background: rgba(8,8,8,0.98);
                    backdrop-filter: blur(24px);
                    border-top: 1px solid rgba(212,175,55,0.2);
                    padding: 4px 0 env(safe-area-inset-bottom, 4px);
                    box-shadow: 0 -10px 30px rgba(0,0,0,0.4);
                }
                .bottom-nav-item {
                    display: flex; flex-direction: column; align-items: center;
                    gap: 3px; flex: 1; padding: 8px 4px;
                    color: rgba(255,255,255,0.3); transition: 0.2s;
                    position: relative;
                }
                .bottom-nav-item .bn-icon { transition: 0.2s; }
                .bottom-nav-item .bn-label {
                    font-size: 0.58rem; font-weight: 800; text-transform: uppercase;
                    letter-spacing: 0.5px; white-space: nowrap;
                }
                .bottom-nav-item.active { color: var(--primary-gold); }
                .bottom-nav-item.active::before {
                    content: '';
                    position: absolute; top: 0; left: 20%; right: 20%;
                    height: 2px;
                    background: var(--primary-gold);
                    border-radius: 0 0 4px 4px;
                    box-shadow: 0 0 8px var(--primary-gold);
                }
                .bottom-nav-item.active .bn-icon { filter: drop-shadow(0 0 6px rgba(212,175,55,0.6)); }
                .bottom-nav-item:not(.active):hover { color: rgba(255,255,255,0.6); }

                /* ── RESPONSIVE SWITCHES ── */
                @media (max-width: 768px) {
                    .desktop-sidebar { display: none !important; }
                    .mobile-admin-topbar { display: flex; }
                    .mobile-bottom-nav { display: flex; }
                }

                @media (min-width: 769px) {
                    .mobile-admin-topbar { display: none !important; }
                    .mobile-drawer-overlay { display: none !important; }
                    .mobile-bottom-nav { display: none !important; }
                }

                @media (max-width: 1200px) {
                    .desktop-sidebar { width: 240px; }
                }
            `}</style>
        </>
    );
};

export default AdminSidebar;
