import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Small delay to allow Supabase to process the URL fragment/code
      setTimeout(async () => {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setStatus('error');
          setErrorMsg(error.message);
          return;
        }

        if (session) {
          setStatus('success');
          // Redirect to /menu after a short "Success!" message
          setTimeout(() => {
            navigate('/menu');
          }, 2000);
        } else {
          // If no session after 5 seconds, something went wrong
          setStatus('error');
          setErrorMsg("Could not verify your session. Please try logging in manually.");
        }
      }, 1000);
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="auth-callback-page container section-padding min-h-screen pt-[var(--nav-height)]">
      <SEOHead title="Verifying Heritage Account" />
      
      <div className="callback-wrapper glass-card anim-slide-in">
        {status === 'verifying' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="status-content"
          >
            <Loader2 size={48} className="animate-spin gold-text mb-6" />
            <h1>Verifying your <span className="gold-text">Heritage Account</span></h1>
            <p>Please wait while we prepare your connoisseur experience...</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="status-content"
          >
            <CheckCircle size={64} className="text-success mb-6" />
            <h1 className="success-text">Welcome to the <span className="gold-text">Family!</span></h1>
            <p>Your email has been successfully verified. Redirecting you to the menu...</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="status-content"
          >
            <AlertCircle size={64} className="text-error mb-6" />
            <h1>Verification <span className="text-error">Failed</span></h1>
            <p className="mb-8">{errorMsg}</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
               Back to Login
            </button>
          </motion.div>
        )}
      </div>

      <style>{`
        .auth-callback-page {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .callback-wrapper {
          max-width: 500px;
          padding: 4rem;
          width: 100%;
          border: 1px solid var(--border-gold);
        }
        .status-content h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          font-family: var(--font-serif);
        }
        .status-content p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .success-text { color: var(--text-primary); }
      `}</style>
    </div>
  );
};

export default AuthCallback;
