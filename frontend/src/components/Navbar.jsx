import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/cartStore';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const cartCount = useCartStore((state) => state.getCount());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
    };
    
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Offers', path: '/offers' },
    { name: 'Combos', path: '/combos' },
    { name: 'Track', path: '/track' },
  ];



  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <div className="container nav-content">
        
        <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <motion.h1 whileHover={{ scale: 1.05 }}>
            VENKI'S <span className="gold-text">FOODS</span>
          </motion.h1>
          <p className="logo-tagline">ESTD. 1984</p>
        </Link>

        <div className="nav-links-desktop">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="link-text">{link.name}</span>
              {location.pathname === link.path && (
                <motion.div layoutId="nav-underline" className="nav-underline" />
              )}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          {session && (
            <Link to="/cart" className="nav-cart">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingCart size={22} strokeWidth={1.5} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="cart-badge"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )}

          <div className="user-desktop">
            {session ? (
              <div className="user-logged-in">
                {isAdmin && (
                  <Link to="/admin/dashboard" className="admin-pill" title="Admin Dashboard">
                    <LayoutDashboard size={18} />
                  </Link>
                )}
                <Link to="/account" className="account-link" title="My Account">
                  <User size={22} strokeWidth={1.5} />
                </Link>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <div className="auth-nav-group">
                <Link to="/login" className="btn btn-primary btn-sm px-8">
                  GET STARTED
                </Link>
              </div>
            )}
          </div>

          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu glass-card"
          >
            <div className="mobile-links">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={location.pathname === link.path ? 'active' : ''}
                >
                  {link.name}
                </Link>
              ))}
              {session ? (
                <>
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
                  {isAdmin && <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>}
                  <button onClick={handleLogout} className="mobile-logout">
                    Logout <LogOut size={18} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm flex-1" onClick={() => setIsMobileMenuOpen(false)}>GET STARTED</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          height: var(--nav-height);
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
        }
        .navbar.scrolled {
          background: rgba(5, 5, 5, 0.82);
          backdrop-filter: blur(25px);
          border-bottom: 1px solid var(--border-gold);
          height: 70px;
        }
        .nav-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        
        .nav-logo h1 { font-size: 1.4rem; letter-spacing: 2px; color: var(--text-primary); margin: 0; }
        .logo-tagline { font-size: 0.6rem; letter-spacing: 3px; color: var(--text-secondary); margin-top: -2px; font-weight: 800; }
        
        .nav-links-desktop { 
          display: flex; 
          gap: clamp(1rem, 2.5vw, 3rem); 
        }
        .nav-link { 
          position: relative;
          font-weight: 500; 
          color: var(--text-secondary); 
          font-size: 0.85rem; 
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .nav-link.active { color: var(--text-primary); }
        .nav-underline {
          position: absolute;
          bottom: -8px; left: 0; right: 0;
          height: 1.5px;
          background: var(--primary-gold);
        }
        
        .nav-actions { display: flex; align-items: center; gap: 2rem; }
        .nav-cart { position: relative; color: var(--text-primary); }
        .cart-badge {
          position: absolute;
          top: -8px; right: -8px;
          background: var(--gold-gradient);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 800;
          width: 16px; height: 16px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        
        .user-logged-in { display: flex; align-items: center; gap: 1rem; }
        .auth-nav-group { display: flex; align-items: center; gap: 1.5rem; }
        .auth-nav-group .nav-link { font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); cursor: pointer; }
        .auth-nav-group .nav-link:hover { color: var(--text-primary); }
        .auth-nav-group .btn-sm { padding: 8px 20px; font-size: 0.75rem; }
        .admin-pill {
          background: var(--primary-glow);
          color: var(--primary-gold);
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 0.7rem;
          font-weight: 800;
          border: 1px solid var(--border-gold);
          display: flex; align-items: center; gap: 8px;
        }
        .logout-btn { color: var(--text-secondary); transition: 0.3s; }
        .logout-btn:hover { color: var(--error); }
        
        .mobile-menu-toggle { display: block; color: var(--text-primary); }

        @media (min-width: 769px) {
           .mobile-menu-toggle { display: none; }
        }

        @media (max-width: 768px) {
          .nav-links-desktop, .user-desktop { display: none; }
          .mobile-menu {
            position: absolute;
            top: 100%; left: 0; right: 0;
            padding: 2.5rem;
            margin-top: 10px;
            background: var(--bg-card);
            border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          }
          .mobile-links { display: flex; flex-direction: column; gap: 2rem; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
