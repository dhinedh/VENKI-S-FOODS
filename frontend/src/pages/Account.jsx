import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Settings, LogOut, ChevronRight, 
  Clock, CheckCircle, Truck, XCircle, ShoppingBag, 
  Mail, Calendar, MapPin, Heart
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import api from '../lib/api';
import SEOHead from '../components/SEOHead';

const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'profile', 'orders', 'settings'
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [updateMsg, setUpdateMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      setEditName(user.user_metadata?.full_name || '');
      setLoading(false);
      
      // Fetch initial orders
      fetchOrders(user.id);
    };

    fetchUserData();
  }, [navigate]);

  const fetchOrders = async (userId) => {
    setLoadingOrders(true);
    try {
      const { data } = await api.get(`/orders/history/${userId}`);
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMsg({ type: '', text: '' });
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: editName }
      });

      if (error) throw error;
      
      setUser(data.user);
      setIsEditing(false);
      setUpdateMsg({ type: 'success', text: 'Heritage profile updated successfully!' });
      
      // Clear message after 3s
      setTimeout(() => setUpdateMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setUpdateMsg({ type: 'error', text: err.message });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return null; // Loading handled by App Suspense

  const navItems = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'profile', label: 'Personal Info', icon: User },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="account-page container section-padding">
      <SEOHead title="My Account | Venki's Foods" />

      <div className="account-layout">
        {/* Sidebar Nav */}
        <aside className="account-sidebar">
          <div className="user-profile-card glass-card">
            <div className="profile-avatar">
              {user?.user_metadata?.full_name?.[0] || user?.email?.[0].toUpperCase()}
            </div>
            <div className="profile-info">
              <h3>{user?.user_metadata?.full_name || 'Valued Connoisseur'}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <nav className="account-nav mt-8">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
              >
                <item.icon size={20} strokeWidth={1.5} />
                <span>{item.label}</span>
                {activeTab === item.id && <motion.div layoutId="tab-indicator" className="tab-indicator" />}
              </button>
            ))}
            <button onClick={handleLogout} className="nav-btn logout">
              <LogOut size={20} strokeWidth={1.5} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="account-content">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="content-section"
              >
                <div className="section-header-row">
                  <h2 className="section-title-sm">Order <span>History</span></h2>
                  <span className="count-badge">{orders.length} Orders</span>
                </div>

                {loadingOrders ? (
                  <div className="loading-placeholder">Refreshing your orders...</div>
                ) : orders.length > 0 ? (
                  <div className="orders-stack">
                    {orders.map(order => (
                      <div key={order.id} className="order-row glass-card">
                        <div className="order-row-info">
                          <div className="order-id">#{order.id.substring(0, 8)}</div>
                          <div className="order-date">
                            <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="order-row-items">
                           {order.items.slice(0, 2).map((item, i) => (
                             <span key={i}>{item.name}{i < Math.min(order.items.length, 2) - 1 ? ', ' : ''}</span>
                           ))}
                           {order.items.length > 2 && <span className="more-text">+{order.items.length - 2} more</span>}
                        </div>

                        <div className="order-row-status">
                          <div className={`status-pill ${order.status}`}>
                            {order.status.replace(/_/g, ' ')}
                          </div>
                          <div className="order-total">₹{order.total_price}</div>
                        </div>

                        <Link to={`/track/${order.id}`} className="view-link">
                          <ChevronRight size={20} />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state glass-card">
                    <ShoppingBag size={48} opacity={0.2} />
                    <p>No orders yet. Taste our heritage today!</p>
                    <Link to="/menu" className="btn btn-secondary btn-sm mt-4">Browse Menu</Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="content-section"
              >
                <h2 className="section-title-sm">Personal <span>Details</span></h2>
                
                {updateMsg.text && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`update-msg-pill ${updateMsg.type}`}
                  >
                    {updateMsg.type === 'success' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                    {updateMsg.text}
                  </motion.div>
                )}

                <div className="profile-grid mt-8">
                  <div className="info-box glass-card">
                    <label><User size={16}/> Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="edit-input" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <p>{user?.user_metadata?.full_name || 'Not Provided'}</p>
                    )}
                  </div>
                  <div className="info-box glass-card readonly">
                    <label><Mail size={16}/> Email Address</label>
                    <p>{user?.email}</p>
                  </div>
                  <div className="info-box glass-card readonly">
                    <label><Calendar size={16}/> Member Since</label>
                    <p>{new Date(user?.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="info-box glass-card readonly">
                    <label><Heart size={16}/> Loyalty Status</label>
                    <p className="gold-text font-bold">Heritage Member</p>
                  </div>
                </div>
                
                <div className="profile-update-banner glass-card mt-12">
                   <div className="banner-text">
                      <h3>Update Profile</h3>
                      <p className="text-secondary">Changing your personal details will take effect on your next order.</p>
                   </div>
                   {isEditing ? (
                     <div className="edit-actions">
                        <button onClick={() => setIsEditing(false)} className="btn-text mr-4">Cancel</button>
                        <button onClick={handleUpdateProfile} className="btn-gold-sm">Save Changes</button>
                     </div>
                   ) : (
                     <button onClick={() => setIsEditing(true)} className="btn btn-secondary">Edit Profile</button>
                   )}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="content-section"
              >
                <h2 className="section-title-sm">Account <span>Settings</span></h2>
                <div className="settings-list mt-8">
                  <div className="setting-item glass-card">
                     <div>
                        <h4>Email Notifications</h4>
                        <p className="text-xs text-secondary">Receive updates about your delivery status.</p>
                     </div>
                     <div className="toggle active"></div>
                  </div>
                  <div className="setting-item glass-card">
                     <div>
                        <h4>Direct WhatsApp Support</h4>
                        <p className="text-xs text-secondary">Get rapid alerts on WhatsApp for every status change.</p>
                     </div>
                     <div className="toggle active"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        .account-page { min-height: 80vh; }
        .account-layout { display: grid; grid-template-columns: 320px 1fr; gap: 4rem; align-items: start; }
        
        .user-profile-card { padding: 2rem; display: flex; align-items: center; gap: 1.5rem; }
        .profile-avatar { 
          width: 50px; height: 50px; background: var(--gold-gradient); 
          color: #fff; border-radius: 50%; display: flex; 
          align-items: center; justify-content: center; 
          font-weight: 800; font-size: 1.25rem;
          box-shadow: 0 10px 20px var(--primary-glow);
        }
        .profile-info h3 { font-size: 1.1rem; margin-bottom: 2px; }
        .profile-info p { font-size: 0.75rem; color: var(--text-secondary); }

        .account-nav { display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 1rem 1.5rem; border-radius: var(--radius-md);
          font-weight: 600; color: var(--text-secondary);
          position: relative; transition: 0.3s;
          text-align: left;
        }
        .nav-btn:hover { background: rgba(0,0,0,0.02); color: var(--text-primary); }
        .nav-btn.active { color: var(--primary-gold); }
        .tab-indicator {
          position: absolute; left: 0; top: 25%; bottom: 25%;
          width: 3px; background: var(--primary-gold);
          border-radius: 0 4px 4px 0;
        }
        .nav-btn.logout:hover { color: var(--error); background: rgba(255,0,0,0.02); }

        .section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .section-title-sm { font-size: 2rem; }
        .count-badge { background: var(--border-glass); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }

        .orders-stack { display: flex; flex-direction: column; gap: 1rem; }
        .order-row { 
          padding: 1.5rem 2rem; display: grid; 
          grid-template-columns: 120px 1fr 200px 40px; 
          align-items: center; gap: 2rem;
          transition: 0.3s;
        }
        .order-row:hover { border-color: var(--primary-gold); transform: translateX(5px); }
        .order-id { font-weight: 800; font-family: monospace; }
        .order-date { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; }
        .order-row-items { font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .more-text { color: var(--primary-gold); font-size: 0.75rem; }
        
        .order-row-status { display: flex; align-items: center; gap: 1.5rem; justify-content: flex-end; }
        .order-total { font-weight: 800; font-size: 1.1rem; color: var(--text-primary); width: 80px; text-align: right; }
        .view-link { color: var(--text-secondary); opacity: 0.3; transition: 0.3s; }
        .order-row:hover .view-link { opacity: 1; color: var(--primary-gold); }

        .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .info-box { padding: 1.5rem; transition: 0.3s; }
        .info-box label { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
        .info-box p { font-size: 1.1rem; font-weight: 600; }
        .info-box.readonly { opacity: 0.7; }
        
        .edit-input { 
          width: 100%; background: none; border: none; 
          border-bottom: 2px solid var(--primary-gold); 
          font-size: 1.1rem; font-weight: 600; font-family: inherit;
          color: var(--text-primary); padding-bottom: 4px;
        }
        .edit-input:focus { outline: none; border-color: var(--text-primary); }

        .update-msg-pill { 
          background: var(--bg-card); 
          padding: 0.75rem 1.25rem; border-radius: 30px; 
          display: flex; align-items: center; gap: 10px; 
          font-size: 0.85rem; font-weight: 700; 
          margin-bottom: 1rem; width: fit-content;
        }
        .update-msg-pill.success { color: var(--success); border: 1px solid var(--success); }
        .update-msg-pill.error { color: var(--error); border: 1px solid var(--error); }

        .profile-update-banner { 
          display: flex; justify-content: space-between; align-items: center; 
          padding: 2.5rem 3rem; border: 1px solid var(--border-gold); 
        }
        .banner-text h3 { font-size: 1.25rem; margin-bottom: 5px; }
        .banner-text p { font-size: 0.85rem; color: var(--text-secondary); max-width: 400px; }
        .edit-actions { display: flex; align-items: center; }

        .settings-list { display: flex; flex-direction: column; gap: 1rem; }
        .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; }
        .setting-item h4 { font-size: 1rem; margin-bottom: 2px; }
        .toggle { width: 40px; height: 20px; background: var(--border-gold); border-radius: 20px; position: relative; cursor: pointer; }
        .toggle.active { background: var(--primary-gold); }
        .toggle::after { content: ''; position: absolute; left: 2px; top: 2px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: 0.3s; }
        .toggle.active::after { left: 22px; }

        .empty-state { padding: 5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .loading-placeholder { padding: 4rem; text-align: center; font-style: italic; color: var(--text-secondary); }

        @media (max-width: 991px) {
          .account-layout { grid-template-columns: 1fr; gap: 2.5rem; }
          .order-row { grid-template-columns: 1fr 1fr; gap: 1rem; }
          .order-row-items { grid-column: span 2; }
          .order-row-status { justify-content: space-between; }
          .profile-grid { grid-template-columns: 1fr; }
          .profile-update-banner { flex-direction: column; text-align: center; gap: 1.5rem; padding: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Account;
