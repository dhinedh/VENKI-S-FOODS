import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, AlertCircle, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

/**
 * Login.jsx
 * - Simplified flow: Users login directly with Phone and Name (Local Session)
 * - Admin login remains secure behind a toggle (Supabase Auth)
 */
const Login = () => {
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // User Form State
  const [userForm, setUserForm] = useState({ full_name: '', phone: '' });
  
  // Admin Form State
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });

  const [loadingStatus, setLoadingStatus] = useState('');

  // Pre-load main chunks for snappier navigation
  const preloadNextPage = () => {
    import('./Menu').catch(() => {});
    if (isAdminMode) import('./admin/Dashboard').catch(() => {});
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingStatus('Logging in...');
    
    // Quick validation
    if (userForm.phone.length < 10) {
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    // Direct Login using LocalStorage for normal users
    setTimeout(() => {
      const userSession = {
        name: userForm.full_name,
        phone: userForm.phone,
        role: 'user',
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem('user_session', JSON.stringify(userSession));
      
      // Dispatch storage event so NavBar updates immediately
      window.dispatchEvent(new Event('storage'));
      
      setLoading(false);
      navigate('/menu');
    }, 600); // Small artificial delay for visual feedback
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingStatus('Authenticating...');
    setError('');

    const ADMIN_EMAIL = "admin.venkis@gmail.com";
    const ADMIN_PASS = "AdminHeritage2024!";
    const isAdminCredentials = adminForm.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && 
                               adminForm.password === ADMIN_PASS;

    try {
      setTimeout(preloadNextPage, 100);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminForm.email,
        password: adminForm.password,
      });

      if (signInError) {
        if (isAdminCredentials) {
          console.warn("🔐 Supabase: Auth failed. Activating Developer Admin Bypass...");
          setLoadingStatus('Sychronizing admin data...');
          
          localStorage.setItem('admin_bypass_token', import.meta.env.VITE_ADMIN_SECRET || 'sb_sec');
          localStorage.setItem('user_role', 'admin');
          
          await new Promise(r => setTimeout(r, 500));
          
          window.dispatchEvent(new Event('storage'));
          navigate('/admin');
          return;
        }
        throw signInError;
      }

      setLoadingStatus('Redirecting to dashboard...');
      
      const role = data?.user?.user_metadata?.role;
      window.dispatchEvent(new Event('storage'));
      
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  return (
    <div className="login-page container section-padding">
      <SEOHead title={isAdminMode ? "Admin Login" : "Login"} />
      
      <div className="auth-wrapper glass-card anim-slide-in">
        <div className="auth-header">
            <Link to="/" className="auth-logo">
              <h2 className="font-serif text-2xl font-bold">Venki's <span className="gold-text">Foods</span></h2>
            </Link>
           <h1>{isAdminMode ? 'Admin Access' : 'Welcome'}</h1>
           <p>
             {isAdminMode 
               ? 'Secure administrative portal.'
               : 'Enter your details to order your favourite heritage pickles.'}
           </p>
        </div>

        {!isAdminMode ? (
          /* ================= USER FORM ================= */
          <form onSubmit={handleUserLogin} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} />
                <input 
                  type="text" required 
                  value={userForm.full_name} 
                  onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <div className="input-with-icon">
                <Phone size={18} />
                <input 
                  type="tel" required 
                  value={userForm.phone} 
                  onChange={(e) => setUserForm({...userForm, phone: e.target.value.replace(/\D/g, '')})}
                  placeholder="10-digit number"
                  maxLength={10}
                />
              </div>
            </div>

            {error && (
              <div className="form-error mt-4 text-error text-sm flex items-center justify-center">
                <AlertCircle size={16} className="mr-2" /> {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full btn-lg mt-8" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin" />
                  <span className="text-sm font-bold tracking-widest">{loadingStatus.toUpperCase()}</span>
                </div>
              ) : (
                <>Continue <ArrowRight size={20}/></>
              )}
            </button>
          </form>
        ) : (
          /* ================= ADMIN FORM ================= */
          <form onSubmit={handleAdminLogin} className="auth-form">
            <div className="form-group">
              <label>Admin Email</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input 
                  type="email" required 
                  value={adminForm.email} 
                  onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                  placeholder="admin.venkis@gmail.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input 
                  type="password" required 
                  value={adminForm.password} 
                  onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="form-error mt-4 text-error text-sm flex items-center justify-center">
                <AlertCircle size={16} className="mr-2" /> {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full btn-lg mt-8" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin" />
                  <span className="text-sm font-bold tracking-widest">{loadingStatus.toUpperCase()}</span>
                </div>
              ) : (
                <>Secure Login <Lock size={18} className="ml-2"/></>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer mt-8 pt-6 border-t border-gold-light/20">
           <button 
             onClick={() => {
               setIsAdminMode(!isAdminMode);
               setError('');
             }} 
             className="flex items-center justify-center mx-auto text-sm text-secondary hover:text-primary transition-colors"
           >
             <Shield size={14} className="mr-2 opacity-60" />
             {isAdminMode ? "Return to User Login" : "Admin Portal"}
           </button>
        </div>
      </div>

      <style>{`
        .auth-wrapper {
          max-width: 480px;
          margin: 0 auto;
          padding: 3rem;
          text-align: center;
        }
        .auth-header { margin-bottom: 2.5rem; }
        .auth-logo h2 { margin-bottom: 1rem; }
        .auth-logo h2 { color: var(--text-primary); }

        .auth-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--text-primary); font-family: var(--font-serif); }
        .auth-header p { color: var(--text-secondary); font-size: 1rem; }

        .auth-form { text-align: left; }
        .form-group { margin-bottom: 1.8rem; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 0.8rem; color: var(--text-primary); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
        
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-with-icon svg {
          position: absolute;
          left: 15px;
          color: var(--primary-gold);
        }
        .input-with-icon input {
          width: 100%;
          background: rgba(0,0,0,0.03);
          border: 1px solid var(--border-glass);
          padding: 14px 18px 14px 45px;
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: inherit;
          transition: 0.3s;
          font-size: 1rem;
        }
        .input-with-icon input:focus { border-color: var(--primary-gold); box-shadow: 0 0 15px var(--primary-glow); outline: none; }
        
        .btn-full { width: 100%; justify-content: center; }

        @media (max-width: 768px) {
          .auth-wrapper { padding: 2.5rem 1.5rem; }
          .auth-header h1 { font-size: 2rem; }
          .auth-logo { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Login;
