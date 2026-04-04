import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * ProtectedRoute.jsx
 * - Check Supabase session. If no session redirect to /login.
 * - If requireAdmin prop is true, check user metadata for admin role.
 * - If not admin redirect to /.
 * - While checking session show a loading spinner.
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        
        // 1. Check for real Supabase session
        if (supabaseSession) {
          setSession(supabaseSession);
          setIsAdmin(supabaseSession.user?.user_metadata?.role === 'admin');
        } 
        // 2. Otherwise, check for Developer Bypass or Local User Session
        else {
          const bypassToken = localStorage.getItem('admin_bypass_token');
          const bypassRole = localStorage.getItem('user_role');
          const localUser = localStorage.getItem('user_session');
          
          if (bypassToken && bypassRole === 'admin') {
            console.log("🛠️ ProtectedRoute: Active Developer Admin Bypass detected.");
            setSession({ user: { email: 'admin.venkis@gmail.com' }, role: 'admin' }); // Mock session
            setIsAdmin(true);
          } else if (localUser) {
            // Standard direct login user
            setSession(JSON.parse(localUser));
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };


    checkSession();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, supabaseSession) => {
      if (supabaseSession) {
        setSession(supabaseSession);
        setIsAdmin(supabaseSession.user.user_metadata?.role === 'admin');
      } else {
        // Even if Supabase session is null, check if we have a bypass active
        const bypassToken = localStorage.getItem('admin_bypass_token');
        const localUser = localStorage.getItem('user_session');

        if (bypassToken) {
          setIsAdmin(true);
          setSession({ user: { email: 'admin.venkis@gmail.com' }, role: 'admin' });
        } else if (localUser) {
          setIsAdmin(false);
          setSession(JSON.parse(localUser));
        } else {
          setSession(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });


    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verifying Access...</p>
      </div>
    );
  }

  // If no session redirect to /login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If requireAdmin prop is true, check user metadata for admin role
  if (requireAdmin && !isAdmin) {
    console.warn("[Security] Non-admin user attempted to access admin route.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
