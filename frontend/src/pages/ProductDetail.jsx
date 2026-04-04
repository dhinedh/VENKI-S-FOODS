import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, ArrowLeft, Plus, Minus, Send, AlertCircle, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import useCartStore from '../store/cartStore';
import products from '../data/products.json';
import api from '../lib/api';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import LazyImage from '../components/LazyImage';

/**
 * ProductDetail.jsx
 * - Fetch product data from products.json by id.
 * - Grid: Left (Image), Right (Details: Name, Tags, Price, Description, is_veg badge).
 * - Counter and "Add to Cart" button.
 * - Reviews Section: Fetch approved reviews from /api/reviews/:productId.
 * - Verified Buyer Form: If logged in, show review form. Submit to /api/reviews.
 */
import productsData from '../data/products.json';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = useState(productsData.find(p => String(p.id) === String(id)));
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  // Review Form State
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', order_id: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Double check dynamic product data for live updates (Hydration)
      try {
        const { data: dynamicProd } = await api.get(`/products/${id}`);
        if (dynamicProd) setProduct(dynamicProd);
      } catch (err) {
        console.warn("ProductDetail: Using static JSON fallback.");
      } finally {
        setLoading(false);
      }


      // 2. Fetch Reviews
      try {
        const { data } = await api.get(`/reviews/${id}`);
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews");
      } finally {
        setLoadingReviews(false);
      }

      // 3. Get User for Review Form
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);
      } catch (e) {
        // Not logged in, that's fine
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading && !product) return (
    <div className="container py-20 text-center">
      <Loader2 className="animate-spin" size={48} />
    </div>
  );
  
  if (!product) return (
    <div className="container py-20 text-center">
       <h2>Product Not Found</h2>
       <Link to="/menu" className="btn btn-primary mt-6">Return to Menu</Link>
    </div>
  );


  const handleAddToCart = async () => {
    addItem({ ...product }, qty);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setReviewMsg({ type: '', text: '' });

    try {
      const { data } = await api.post('/reviews', {
        user_id: user.id,
        product_id: product.id,
        ...reviewForm
      });
      setReviewMsg({ type: 'success', text: "Review submitted! It will appear after admin approval." });
      setReviewForm({ rating: 5, comment: '', order_id: '' });
    } catch (err) {
      setReviewMsg({ type: 'error', text: err.response?.data?.error || "Review submission failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <div className="product-page container section-padding">
      <SEOHead 
        title={`${product.name} | Venki's Foods`} 
        description={product.description} 
        image={product.image}
      />

      <Link to="/menu" className="back-link">
        <ArrowLeft size={20} /> Back to Menu
      </Link>

      <div className="product-layout grid grid-2 section-padding pt-6">
        {/* Left: Image */}
        <div className="product-visual">
          <div className="detail-img-wrapper glass-card">
            <LazyImage src={product.image} alt={product.name} className="detail-img" />
          </div>
          <div className="detail-badges">
            <div className={`diet-pill ${product.is_veg ? 'veg' : 'non-veg'}`}>
              <div className="dot"></div>
              {product.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}
            </div>
            {product.tags.map(tag => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="product-info">
          <span className="category-label">{product.category}</span>
          <h1 className="product-title">{product.name}</h1>
          
          <div className="rating-row">
            <div className="stars">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={18} fill={s <= Math.round(avgRating) ? "var(--primary-color)" : "none"} color="var(--primary-color)" />
              ))}
            </div>
            <span className="rating-count">({reviews.length} Verified Reviews)</span>
          </div>

          <div className="price-tag">₹{product.price}</div>
          
          <p className="product-desc">{product.description}</p>

          <div className="trust-badges mt-8">
            <div className="trust-item"><ShieldCheck size={20} /> No Preservatives</div>
            <div className="trust-item"><Truck size={20} /> 60-Min Delivery</div>
          </div>

          <div className="purchase-controls mt-10">
            <div className="qty-picker">
              <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={18}/></button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}><Plus size={18}/></button>
            </div>
            <button 
              className={`btn btn-primary btn-lg flex-1 ${!product.is_available ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={!product.is_available}
            >
               <ShoppingBag size={20} /> {product.is_available ? 'Add to Cart' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section section-padding">
        <div className="divider-glow mb-12"></div>
        
        <div className="reviews-header-perfected">
          <div className="header-text-group">
            <span className="section-label gold-gradient-text">Heritage Chronicles</span>
            <h2 className="section-title-large">Customer <span className="gold-text-glow">Feedback</span></h2>
            <p className="subtitle-elegant">Insights from our verified connoisseurs since 1984. Every jar tells a story.</p>
          </div>
          
          <div className="avg-rating-hero-box glass-card-obsidian">
              <div className="rating-visual-row">
                 <span className={`rating-score-huge ${avgRating === 'New' ? 'is-new' : ''}`}>{avgRating}</span>
                 <div className="star-rating-vertical">
                   <div className="stars-row">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={16} fill={typeof avgRating === 'number' && s <= Math.round(avgRating) ? "var(--primary-gold)" : "none"} color="var(--primary-gold)" />
                    ))}
                   </div>
                   <div className="rating-label-tiny">AVERAGE RATING</div>
                 </div>
              </div>
          </div>
        </div>

        <div className="reviews-layout">
          {/* Review List */}
          <div className="reviews-list">
            {loadingReviews ? (
              <div className="flex flex-col items-center py-10 gap-4">
                 <Loader2 className="animate-spin text-gold" size={32} />
                 <p className="text-secondary">Gathering feedback...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="review-card glass-card anim-fade-in">
                  <div className="review-top">
                    <div className="stars">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} fill={s <= review.rating ? "var(--primary-color)" : "none"} color="var(--primary-color)" />
                      ))}
                    </div>
                    <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="review-comment">"{review.comment}"</p>
                  <div className="author-bar mt-6">
                    <div className="author-avatar">{review.user_name?.[0]?.toUpperCase() || 'U'}</div>
                    <div className="author-info">
                       <span className="author-name">{review.user_name || 'Anonymous User'}</span>
                       <span className="author-status">Verified Buyer</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-reviews-artistic glass-card-obsidian">
                  <div className="artistic-icon-container">
                    <Sparkles size={64} className="gold-text-glow opacity-30" />
                    <ShoppingBag size={32} className="absolute-center gold-text" />
                  </div>
                  <h3>Be the First Pioneer</h3>
                  <p className="connoisseur-note">This artisanal batch is awaiting its first verified review. Share your heritage experience with the world.</p>
                  <div className="minimal-divider"></div>
              </div>
            )}
          </div>

          {/* Review Submission Form (Verified Buyers Only) */}
          <div className="review-form-container">
            {user ? (
              <div className="review-form-card glass-card">
                <h3>Rate this product</h3>
                <p className="text-sm text-secondary mb-6">Only customers who have purchased this product can leave a review.</p>
                <form onSubmit={handleSubmitReview}>
                  <div className="form-group">
                    <label>Order ID (Required for verification)</label>
                    <input 
                      type="text" required placeholder="Paste your Order ID from My Orders" 
                      value={reviewForm.order_id} onChange={(e) => setReviewForm({...reviewForm, order_id: e.target.value})}
                    />
                  </div>
                  <div className="form-group mt-4">
                    <label>Rating</label>
                    <select value={reviewForm.rating} onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}>
                      <option value="5">5 Stars - Amazing</option>
                      <option value="4">4 Stars - Very Good</option>
                      <option value="3">3 Stars - Good</option>
                      <option value="2">2 Stars - Average</option>
                      <option value="1">1 Star - Poor</option>
                    </select>
                  </div>
                  <div className="form-group mt-4">
                    <label>Your Feedback</label>
                    <textarea 
                      required rows="4" placeholder="How was the taste, texture, and spice level?"
                      value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    ></textarea>
                  </div>

                  {reviewMsg.text && (
                    <div className={`form-msg ${reviewMsg.type}`}>
                      {reviewMsg.type === 'error' ? <AlertCircle size={18}/> : <ShieldCheck size={18}/>}
                      {reviewMsg.text}
                    </div>
                  )}

                  <button type="submit" className="btn-submit-review" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Authenticating Order...
                      </>
                    ) : (
                      <>
                        Submit Review <Send size={18}/>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="login-to-review glass-card-obsidian anim-fade-in">
                <h3 className="gold-text-glow">Share Your Experience</h3>
                <p className="text-secondary mb-8">Log in to leave a verified buyer review and join our heritage community.</p>
                <Link to="/login" className="btn-submit-review" style={{ textDecoration: 'none' }}>
                  LOGIN TO REVIEW <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .product-page { padding-bottom: 8rem; } /* SAFE AREA for floating actions */
        .back-link { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--text-secondary); transition: 0.3s; }
        .back-link:hover { color: var(--primary-color); }
        .pt-6 { padding-top: 2rem; }
        
        .grid-2 { display: grid; grid-template-columns: 1.2fr 1fr; gap: 5rem; }
        .detail-img-wrapper { border-radius: 40px; overflow: hidden; position: relative; }
        .detail-img { width: 100%; height: 500px; object-fit: cover; }
        
        .detail-badges { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; }
        .diet-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass);
          padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 0.9rem;
        }
        .diet-pill .dot { width: 10px; height: 10px; border-radius: 50%; }
        .diet-pill.veg .dot { background: #4caf50; boxShadow: 0 0 10px #4caf50; }
        .diet-pill.non-veg .dot { background: #f44336; boxShadow: 0 0 10px #f44336; }
        .tag-pill { background: var(--primary-glow); color: var(--primary-color); padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 0.9rem; }

        .category-label { color: var(--primary-color); font-weight: 800; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 2px; }
        .product-title { font-size: 3.5rem; margin-top: 0.5rem; }
        .rating-row { display: flex; align-items: center; gap: 15px; margin-top: 1rem; }
        .rating-count { color: var(--text-secondary); font-weight: 600; }
        .price-tag { font-size: 3rem; font-weight: 700; margin: 2rem 0; color: #fff; }
        .product-desc { font-size: 1.15rem; color: var(--text-secondary); max-width: 500px; }
        
        .trust-badges { display: flex; gap: 2rem; }
        .trust-item { display: flex; align-items: center; gap: 10px; font-weight: 700; color: var(--text-secondary); }
        
        .purchase-controls { display: flex; gap: 1.5rem; }
        .qty-picker {
          display: flex; align-items: center; gap: 20px;
          background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass);
          padding: 0 20px; border-radius: var(--radius-md); font-size: 1.25rem; font-weight: 700;
        }
        .qty-picker button { color: var(--primary-color); padding: 10px 0; }
        .flex-1 { flex: 1; }
        .mt-10 { margin-top: 2.5rem; }

        .divider-glow { height: 1px; background: linear-gradient(to right, transparent, var(--border-gold), transparent); opacity: 0.3; }
        
        .reviews-header-perfected { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5rem; gap: 3rem; }
        .header-text-group { flex: 1; }
        .section-title-large { font-size: 3.5rem; line-height: 1.1; margin: 0.5rem 0; }
        .gold-text-glow { color: var(--primary-gold); text-shadow: 0 0 20px var(--primary-glow); }
        .gold-gradient-text { background: var(--gold-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; }
        .subtitle-elegant { color: var(--text-secondary); font-size: 1.1rem; max-width: 500px; line-height: 1.6; }

        .glass-card-obsidian { 
          background: rgba(15, 15, 15, 0.6); 
          backdrop-filter: blur(20px); 
          border: 1px solid rgba(212, 175, 55, 0.15); 
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
          border-radius: var(--radius-lg);
          transition: 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .glass-card-obsidian:hover { border-color: var(--primary-gold); box-shadow: 0 30px 60px rgba(212, 175, 55, 0.08); transform: translateY(-5px); }

        .avg-rating-hero-box { padding: 2rem 3.5rem; min-width: 280px; }
        .rating-visual-row { display: flex; align-items: center; gap: 2rem; }
        .rating-score-huge { font-size: 4.5rem; font-weight: 900; color: var(--primary-gold); line-height: 1; font-family: var(--font-serif); }
        .rating-score-huge.is-new { font-size: 2rem; text-transform: uppercase; letter-spacing: 4px; opacity: 0.9; }
        
        .star-rating-vertical { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
        .stars-row { display: flex; gap: 4px; }
        .rating-label-tiny { font-size: 0.65rem; font-weight: 900; color: var(--text-secondary); letter-spacing: 2px; }
        
        .reviews-layout { display: grid; grid-template-columns: 1.2fr 450px; gap: 6rem; position: relative; }
        .review-card { padding: 3rem; margin-bottom: 2.5rem; border-color: rgba(255,255,255,0.03); }
        .review-top { display: flex; justify-content: space-between; margin-bottom: 2rem; position: relative; }
        .review-top::after { content: ''; position: absolute; bottom: -1rem; left: 0; width: 40px; height: 1px; background: var(--primary-gold); }
        
        .review-comment { font-style: italic; font-size: 1.2rem; line-height: 1.9; color: #fff; position: relative; padding-left: 1rem; }
        .review-comment::before { content: '“'; position: absolute; left: -1.5rem; top: -1rem; font-size: 4rem; color: var(--primary-gold); opacity: 0.15; font-family: var(--font-serif); }
        
        .author-bar { display: flex; align-items: center; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.05); pt-6; margin-top: 2.5rem; }
        .author-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--gold-gradient); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem; color: #000; box-shadow: 0 0 15px rgba(212, 175, 55, 0.3); }
        .author-name { font-size: 1rem; }
        .author-status { color: var(--primary-gold); font-size: 0.75rem; letter-spacing: 1.5px; }

        .no-reviews-artistic { padding: 6rem 4rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .artistic-icon-container { position: relative; margin-bottom: 1rem; }
        .absolute-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .no-reviews-artistic h3 { font-size: 1.8rem; font-family: var(--font-serif); }
        .connoisseur-note { color: var(--text-secondary); max-width: 320px; line-height: 1.7; font-size: 0.95rem; }
        .minimal-divider { width: 60px; height: 1px; background: var(--gold-gradient); margin-top: 1rem; opacity: 0.5; }
        
        .review-form-card { padding: 3.5rem; border: 1px solid rgba(212, 175, 55, 0.3); }
        .review-form-card h3 { font-size: 2.2rem; margin-bottom: 0.5rem; color: #fff; font-family: var(--font-serif); }
        
        .form-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.8rem; }
        .form-group label { font-size: 0.75rem; font-weight: 800; color: var(--primary-gold); text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.8; }
        
        .form-group input, .form-group select, .form-group textarea {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 14px 18px;
          color: #f0f0f0;
          font-size: 1rem;
          transition: all 0.3s ease;
          width: 100%;
          outline: none;
        }

        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--primary-gold);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }

        .form-group select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 15px center; background-size: 18px; padding-right: 45px; }
        .form-group textarea { resize: vertical; min-height: 140px; line-height: 1.6; }
        
        .btn-submit-review {
          width: 100%;
          padding: 1.2rem;
          border-radius: 12px;
          background: var(--gold-gradient);
          color: #000;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: 0.4s;
          border: none;
          cursor: pointer;
          margin-top: 2rem;
        }
        .btn-submit-review:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3); opacity: 0.95; }
        .btn-submit-review:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .login-to-review { padding: 6rem 3rem; box-shadow: inset 0 0 100px rgba(212, 175, 55, 0.03); }

        @media (max-width: 1400px) {
           .reviews-layout { gap: 4rem; grid-template-columns: 1fr 400px; }
           .section-title-large { font-size: 2.8rem; }
        }

        @media (max-width: 991px) {
          .reviews-header-perfected { flex-direction: column; align-items: stretch; text-align: center; gap: 3rem; margin-bottom: 4rem; }
          .subtitle-elegant { margin: 0.5rem auto; }
          .avg-rating-hero-box { min-width: 0; }
          .rating-visual-row { justify-content: center; }
          .reviews-layout { grid-template-columns: 1fr; gap: 4rem; }
          .review-form-container { order: -1; }
          .review-card { padding: 2rem; }
          .grid-2 { grid-template-columns: 1fr; gap: 2rem; }
          .product-title { font-size: 2.5rem; }
          .price-tag { font-size: 2rem; margin: 1rem 0; }
          .section-title-large { font-size: 2.4rem; }
        }

        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr; gap: 1.5rem; }
          .product-title { font-size: 2rem; }
          .price-tag { font-size: 1.8rem; margin: 0.75rem 0; }
          .detail-img { height: 320px; }
          .detail-img-wrapper { border-radius: 20px; }
          .product-desc { font-size: 1rem; max-width: 100%; }
          .trust-badges { flex-wrap: wrap; gap: 1rem; }
          .purchase-controls { flex-direction: row; flex-wrap: wrap; gap: 1rem; }
          .qty-picker { flex: none; width: auto; padding: 0 16px; }
          .section-title-large { font-size: 2rem; }
          .reviews-header-perfected { margin-bottom: 2.5rem; gap: 2rem; }
          .review-card { padding: 1.5rem; }
          .review-comment { font-size: 1rem; }
          .no-reviews-artistic { padding: 3rem 1.5rem; }
          .avg-rating-hero-box { padding: 1.5rem 2rem; }
          .login-to-review { padding: 3rem 1.5rem; }
          .review-form-card { padding: 1.5rem; }
          .product-layout { padding-left: 1rem; padding-right: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
