import React, { useState, useEffect } from 'react';
import { 
  Star, CheckCircle2, XCircle, Clock, 
  ArrowLeft, Search, Loader2, MessageSquare, 
  ThumbsUp, Trash2, ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import products from '../../data/products.json';
import api from '../../lib/api';
import SEOHead from '../../components/SEOHead';

/**
 * Reviews.jsx (Admin)
 * - Fetch reviews with is_approved=false from /api/admin/reviews.
 * - List: Product Name, Rating, Comment, User ID.
 * - Approve Button: PATCH to /api/admin/reviews/:id with { is_approved: true }.
 */
const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/reviews');
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (reviewId) => {
    setUpdatingId(reviewId);
    try {
      await api.patch(`/admin/reviews/${reviewId}`, { is_approved: true });
      // Remove from pending list
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      alert("Approval failed: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setUpdatingId(reviewId);
    try {
      // For rejection, we'll just delete the record in this implementation
      // or optionally PATCH to is_approved: false (already default)
      // Spec says PATCH is_approved toggle.
      await api.patch(`/admin/reviews/${reviewId}`, { is_approved: false });
      // Remove from view anyway or show as rejected
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      alert("Rejection failed: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getProductName = (id) => {
    return products.find(p => p.id === id)?.name || "Unknown Product";
  };

  return (
    <div className="admin-reviews container section-padding">
      <SEOHead title="Admin | Review Moderation" />

      <div className="admin-header">
        <div>
          <Link to="/admin" className="back-link"><ArrowLeft size={18}/> Back to Dashboard</Link>
          <h1 className="mt-2 text-3xl font-bold">Review <span>Moderation</span></h1>
        </div>
        <div className="stats-pill glass-card">
           <MessageSquare size={18} color="var(--primary-color)"/>
           <span>{reviews.length} Pending Approvals</span>
        </div>
      </div>

      <main className="reviews-list mt-10">
        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin" size={48}/></div>
        ) : reviews.length > 0 ? (
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review.id} className="review-mod-card glass-card anim-slide-in">
                 <div className="rm-header">
                    <div className="rm-product">
                       <span className="text-xs text-secondary font-bold uppercase">Product</span>
                       <h3>{getProductName(review.product_id)}</h3>
                    </div>
                    <div className="stars">
                       {[1,2,3,4,5].map(s => (
                         <Star key={s} size={14} fill={s <= review.rating ? "var(--primary-color)" : "none"} color="var(--primary-color)" />
                       ))}
                    </div>
                 </div>

                 <div className="rm-body mt-4">
                    <p className="comment">"{review.comment}"</p>
                    <div className="author-info mt-4">
                       <span className="text-xs text-secondary">USER ID: <strong>{review.user_id.substring(0,8)}</strong></span>
                       <span className="text-xs text-secondary flex items-center gap-1"><Clock size={12}/> {new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                 </div>

                 <div className="rm-actions mt-6">
                    <button 
                      className="btn btn-secondary flex-1" 
                      onClick={() => handleReject(review.id)}
                      disabled={updatingId === review.id}
                    >
                       {updatingId === review.id ? "..." : <><XCircle size={18}/> Hide</>}
                    </button>
                    <button 
                      className="btn btn-primary flex-1"
                      onClick={() => handleApprove(review.id)}
                      disabled={updatingId === review.id}
                    >
                       {updatingId === review.id ? "..." : <><ThumbsUp size={18}/> Approve</>}
                    </button>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-pending glass-card">
             <CheckCircle2 size={48} color="var(--success)" opacity={0.5} />
             <h3>All clear!</h3>
             <p>There are no pending reviews for moderation.</p>
          </div>
        )}
      </main>

      <style>{`
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .back-link { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--text-secondary); }
        .stats-pill { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: 40px; font-weight: 700; font-size: 0.9rem; }

        .reviews-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
        .review-mod-card { padding: 2.5rem; display: flex; flex-direction: column; }
        
        .rm-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .rm-title h3 { font-size: 1.1rem; margin-top: 4px; }
        
        .comment { font-style: italic; font-size: 1.1rem; color: var(--text-primary); margin-bottom: 1rem; border-left: 3px solid var(--primary-glow); padding-left: 1rem; }
        .author-info { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-glass); padding-top: 1rem; }
        
        .rm-actions { display: flex; gap: 1rem; }
        .flex-1 { flex: 1; justify-content: center; }

        .no-pending { padding: 5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .no-pending h3 { font-size: 1.5rem; }
        .no-pending p { color: var(--text-secondary); }

        @media (max-width: 576px) {
          .reviews-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminReviews;
