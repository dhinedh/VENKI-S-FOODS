import React from 'react';
import AdminSidebar from './AdminSidebar';
import SEOHead from '../SEOHead';

/**
 * AdminLayout.jsx
 * - Structural wrapper for all /admin routes.
 * - Manages Sidebar + Content Grid.
 * - Removes standard consumer navigation/footer context.
 */
const AdminLayout = ({ children, title = "Admin Management" }) => {
    return (
        <div className="admin-layout-container">
            <SEOHead title={`${title} | Heritage Admin`} />
            
            <AdminSidebar />

            <main className="admin-main-content">
                <header className="admin-top-bar">
                    <div className="top-bar-info">
                        <span className="status-badge live">System Live</span>
                        <div className="system-time">{new Date().toLocaleDateString('en-IN')}</div>
                    </div>
                    <div className="admin-profile-quick">
                        <img src="https://ui-avatars.com/api/?name=Heritage+Admin&background=B8860B&color=fff" alt="Admin" />
                        <div>
                            <p className="name">Heritage Admin</p>
                            <p className="role">Senior Manager</p>
                        </div>
                    </div>
                </header>

                <section className="admin-actual-page-content">
                    {children}
                </section>
            </main>

            <style>{`
                .admin-layout-container {
                    display: flex;
                    min-height: 100vh;
                    background: var(--bg-dark); /* Heritage Obsidian Black */
                    color: var(--text-primary);
                }

                .admin-main-content {
                    flex: 1;
                    padding: 20px 40px 40px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .admin-top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 2rem;
                    background: rgba(18, 18, 18, 0.4);
                    backdrop-filter: blur(15px);
                    border: 1px solid var(--border-gold);
                    border-radius: var(--radius-md);
                }

                .top-bar-info { display: flex; align-items: center; gap: 2rem; }
                .status-badge { 
                    padding: 6px 12px; 
                    border-radius: 20px; 
                    font-size: 0.65rem; 
                    font-weight: 800; 
                    text-transform: uppercase; 
                    letter-spacing: 1px;
                }
                .status-badge.live { background: rgba(0, 200, 83, 0.1); color: #00c853; border: 1px solid rgba(0, 200, 83, 0.2); }
                .system-time { font-family: monospace; font-size: 0.8rem; color: var(--text-secondary); }

                .admin-profile-quick { display: flex; align-items: center; gap: 1rem; }
                .admin-profile-quick img { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--primary-gold); }
                .admin-profile-quick .name { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); line-height: 1; margin: 0; }
                .admin-profile-quick .role { font-size: 0.7rem; color: var(--primary-gold); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

                .admin-actual-page-content {
                    flex: 1;
                    animation: fadeIn 0.8s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .admin-layout-container { flex-direction: column; }
                    .admin-main-content {
                        padding: 70px 12px 90px 12px; /* top bar + bottom nav clearance */
                        gap: 16px;
                    }
                    .admin-top-bar { display: none; } /* replaced by mobile top bar in sidebar */
                }

                @media (min-width: 769px) and (max-width: 991px) {
                    .admin-main-content { padding: 15px; }
                    .admin-top-bar { padding: 0.8rem 1.2rem; }
                    .top-bar-info { gap: 1rem; }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
