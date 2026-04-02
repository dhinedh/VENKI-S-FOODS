import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, Heart, ShieldCheck, Star, Award, Truck, Mail, MapPin } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import SEOHead from '../components/SEOHead';
import productsData from '../data/products.json';

const Home = () => {
  // Always use local products.json — it has the real branded images
  // The API may contain older/different DB records without images
  const products = productsData;

  // Prioritise products with local branded images (non-unsplash)
  const featured = products
    .filter(p => p.image && !p.image.includes('unsplash'))
    .slice(0, 4)
    .concat(products.filter(p => !p.image || p.image.includes('unsplash')))
    .slice(0, 4);

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="home-page overflow-hidden">
      <SEOHead
        title="Venki's Foods | Artisanal Heritage Pickles"
        description="Luxury handcrafted pickles delivered fresh. Experience the authentic taste of 1984."
      />

      {/* Cinematic Hero */}
      <section className="hero container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-label">Homemade with love Since 1984</span>
            <h1 className="hero-title">
              Authentic <br />
              <span className="gold-text italic">South Indian Flavours</span>
            </h1>
            <p className="hero-desc">
              Experience the explosion of our 100% natural, preservative-free Podis, Thokkus and Pickles. Handcrafted recipes delivered fresh to your doorstep.
            </p>
            <div className="hero-actions">
              <Link to="/menu" className="btn btn-primary btn-lg px-12">
                GET STARTED <ChevronRight size={22} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="hero-visual">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="hero-img-container"
          >
            <div className="hero-glow"></div>
            <img
              src="/images/hero.png"
              alt="Artisanal Pickles"
              className="hero-main-img"
            />

            {/* Floating Luxury Badges */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="floating-card glass-card badge-1"
            >
              <Heart size={20} fill="#D4AF37" color="#D4AF37" />
              <div>
                <p className="text-xs font-bold">10K+ SALES</p>
                <p className="text-[10px] text-secondary">Trusted Heritage</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="floating-card glass-card badge-2"
            >
              <Star size={20} fill="#D4AF37" color="#D4AF37" />
              <div>
                <p className="text-xs font-bold">4.9 RATING</p>
                <p className="text-[10px] text-secondary">Verified Reviews</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Heritage Stats Ribbon */}
      <section className="stats-ribbon glass-card container mb-10">
        <div className="stats-grid">
          <div className="stat-item">
            <Award size={24} color="var(--primary-gold)" />
            <div>
              <h4>40+ Years</h4>
              <p>Culinary Legacy</p>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <ShieldCheck size={24} color="var(--primary-gold)" />
            <div>
              <h4>100% Natural</h4>
              <p>Preservative Free</p>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Truck size={24} color="var(--primary-gold)" />
            <div>
              <h4>Pan-India</h4>
              <p>Direct Delivery</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Selection */}
      <section className="featured-products section-padding">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-label">Handcrafted Heritage</span>
            <h2 className="section-title">Featured <span className="gold-text">Collections</span></h2>
          </div>
          
          <div className="product-grid mt-12 mobile-grid-2">
            {featured.map((product) => (
              <FoodCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/menu" className="btn btn-secondary btn-lg group">
              EXPLORE FULL MENU 
              <ChevronRight size={18} className="ml-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      <section className="heritage-split section-padding">
        <div className="container split-grid">
          <div className="split-img glass-card overflow-hidden">
            <img src="/images/image.png" alt="Ingredients" />
          </div>
          <div className="split-content">
            <span className="section-label">Our Philosophy</span>
            <h2 className="section-title">Time-Honored <br />Recipes</h2>
            <p className="text-secondary mb-8">
              We believe in the slow art of pickling. No shortcuts, no preservatives—just the sun, the spice, and the heritage that has defined us for generations.
            </p>
            <div className="philosophy-grid">
              <div className="phi-item">
                <ShieldCheck size={24} color="var(--primary-gold)" />
                <h4>Pure Nature</h4>
                <p>100% Organic Ingredients</p>
              </div>
              <div className="phi-item">
                <ShoppingBag size={24} color="var(--primary-gold)" />
                <h4>Freshly Packed</h4>
                <p>Small Batches Only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Master's Craft (Process Section) */}
      <section className="process-section section-padding">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-label">Our Artisanal Way</span>
            <h2 className="section-title">The Master's <span className="gold-text">Craft</span></h2>
          </div>
          <div className="process-grid mt-16">
            <motion.div
              whileHover={{ y: -10 }}
              className="process-card glass-card"
            >
              <div className="process-number">01</div>
              <h3>Selection</h3>
              <p>Hand-picking only the finest seasonal produce from our local heritage farms.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="process-card glass-card active"
            >
              <div className="process-number">02</div>
              <h3>Marination</h3>
              <p>Traditional sun-drying with heritage spices and cold-pressed sesame oil.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="process-card glass-card"
            >
              <div className="process-number">03</div>
              <h3>Perfection</h3>
              <p>Aged in ceramic jars to achieve the eternal depth of authentic flavor.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Connoisseur Voices (Testimonials) */}
      <section className="testimonials-section section-padding">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-label">Trusted by Families</span>
            <h2 className="section-title">Connoisseur <span className="gold-text">Voices</span></h2>
          </div>
          <div className="testimonials-grid mt-12">
            {[
              { name: "Aditi Sharma", text: "The Chicken Pickle is an explosion of flavor. It tastes exactly like my grandmother's recipe.", rating: 5 },
              { name: "Rahul Verma", text: "Finally found a brand that doesn't use massive amounts of preservatives. The Mango pickle is pure sunshine.", rating: 5 },
              { name: "Meera Iyer", text: "The heritage combo is the perfect gift. The packaging is as premium as the taste.", rating: 5 }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="testimonial-card glass-card"
              >
                <div className="star-rating mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="var(--primary-gold)" color="var(--primary-gold)" />)}
                </div>
                <p className="testimonial-text italic">"{t.text}"</p>
                <div className="testimonial-author mt-6">
                  <div className="author-name font-bold">{t.name}</div>
                  <div className="author-status text-secondary text-xs">Verified Connoisseur</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Club (Newsletter) */}
      <section className="newsletter-section pb-10">
        <div className="container">
          <div className="newsletter-banner glass-card overflow-hidden relative border-gold-refined">
            <div className="newsletter-content text-center mx-auto relative z-10">
              <h2 className="section-title mb-6">Join The <span className="gold-text">Heritage Club</span></h2>
              <p className="text-secondary max-w-xl mx-auto mb-10 text-lg">
                Subscribe to the inner circle for exclusive recipes, member-only offers, and early access to our seasonal batches.
              </p>
              <form className="newsletter-form flex justify-center">
                <div className="input-group-perfect">
                  <Mail size={20} className="text-gold" />
                  <input type="email" placeholder="Enter your email address..." required />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn-gold-sm"
                  >
                    Join Now
                  </motion.button>
                </div>
              </form>
            </div>
            <div className="newsletter-bg-icon">
              <Award size={200} />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero { 
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; 
          min-height: 80vh;
          align-items: center; 
          padding: 3rem 0;
          position: relative;
          z-index: 5;
        }
        .hero-title { 
          font-size: clamp(3.5rem, 8vw, 6rem); 
          margin: 1rem 0 2rem; 
        }
        .hero-desc { font-size: clamp(1rem, 2vw, 1.25rem); color: var(--text-secondary); margin-bottom: 3rem; max-width: 550px; }
        .hero-actions { display: flex; gap: 1.5rem; position: relative; z-index: 10; }
        
        .hero-visual { 
          position: relative; 
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-img-container { 
          position: relative; 
          width: 100%;
          max-width: 450px;
          z-index: 1; 
          perspective: 2000px; 
        }
        .hero-main-img { 
          width: 100%; height: 100%; border-radius: 40px; 
          box-shadow: 0 40px 100px rgba(0,0,0,0.08);
          border: 1px solid var(--border-gold);
          background: var(--bg-card); /* Skeleton fallback */
          object-fit: cover;
        }
        .hero-glow {
          position: absolute; top: -20%; left: -20%; right: -20%; bottom: -20%;
          background: radial-gradient(circle, var(--primary-gold) 0%, transparent 70%);
          filter: blur(80px);
          opacity: 0.1;
          z-index: -1;
        }
        
        .floating-card {
          position: absolute; padding: 1rem 1.5rem;
          display: flex; align-items: center; gap: 15px;
          z-index: 10;
          min-width: 180px;
        }
        .badge-1 { top: 0; left: -15%; }
        .badge-2 { bottom: 10%; right: -15%; }

        .section-header-centered { text-align: center; margin-bottom: 4rem; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2.5rem; }
        
        .split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
        .split-img { height: 600px; border-radius: 40px; }
        .split-img img { width: 100%; height: 100%; object-fit: cover; }
        
        .philosophy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem; }
        .phi-item h4 { font-size: 1.2rem; margin: 10px 0 5px; color: var(--text-primary); }
        .phi-item p { font-size: 0.85rem; color: var(--text-secondary); }

        /* New High-Conversion Sections */
        .stats-ribbon { margin-top: -40px; }
        .stats-grid { display: flex; justify-content: space-around; padding: 2.5rem; align-items: center; }
        .stat-item { display: flex; align-items: center; gap: 1rem; }
        .stat-item h4 { font-size: 1.1rem; margin: 0; }
        .stat-item p { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
        .stat-divider { width: 1px; height: 40px; background: var(--border-glass); }

        .process-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        .process-card { padding: 3.5rem 2.5rem; text-align: center; position: relative; }
        .process-card.active { border-color: var(--primary-gold); box-shadow: 0 20px 60px var(--primary-glow); }
        .process-number { 
          font-size: 4rem; font-weight: 800; color: var(--primary-gold); 
          opacity: 0.1; position: absolute; top: 1rem; left: 1rem; 
        }
        .process-card h3 { font-size: 1.5rem; margin-bottom: 1rem; }
        .process-card p { font-size: 0.9rem; color: var(--text-secondary); }

        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        .testimonial-card { padding: 2.5rem; }
        .testimonial-text { font-size: 1.1rem; line-height: 1.8; color: var(--text-primary); }

        .newsletter-banner { padding: 6rem 4rem; z-index: 1; }
        .newsletter-bg-icon { 
          position: absolute; right: -2%; bottom: -5%; 
          color: var(--primary-gold); opacity: 0.04; z-index: -1; 
          transform: rotate(-15deg);
        }
        .input-group-perfect { 
          display: flex; align-items: center; gap: 15px; 
          background: rgba(255,255,255,0.4); 
          backdrop-filter: blur(10px);
          padding: 8px 8px 8px 24px; 
          border-radius: 50px; 
          border: 1px solid var(--border-gold);
          width: 100%;
          max-width: 600px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
          transition: 0.3s;
        }
        .border-gold-refined { border: 1px solid var(--border-gold); }
        .input-group-perfect:focus-within {
          border-color: var(--primary-gold);
          box-shadow: 0 0 30px var(--primary-glow);
          background: #fff;
          transform: translateY(-2px);
        }
        .input-group-perfect input { 
          flex: 1; background: none; border: none; 
          color: var(--text-primary); font-family: inherit; 
          font-size: 1rem;
        }
        .input-group-perfect input:focus { outline: none; }
        
        .btn-gold-sm {
          background: var(--gold-gradient);
          color: #fff;
          padding: 12px 30px;
          border-radius: 40px;
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 10px 20px var(--primary-glow);
          border: none;
        }

        .text-gold { color: var(--primary-gold); }

        @media (max-width: 991px) {
          .hero { grid-template-columns: 1fr; text-align: center; gap: 2rem; padding: 2rem 0; margin-top: 0; }
          .hero-title { font-size: 2.2rem; margin-bottom: 1.2rem; line-height: 1.2; }
          .hero-desc { margin: 0 auto 2rem; font-size: 0.95rem; }
          .hero-actions { justify-content: center; }
          .hero-visual { height: auto; margin-top: 2rem; }
          .hero-img-container { max-width: 280px; margin: 0 auto; }
          .floating-card { display: none; } /* Hide floating badges on small mobile to reduce clutter */

          .split-grid { grid-template-columns: 1fr; gap: 3rem; }
          .split-img { height: 350px; }
          
          .stats-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; padding: 2rem; }
          .stat-divider { display: none; }
          
          .process-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .testimonials-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          
          .newsletter-banner { padding: 3rem 1.5rem; }
          .input-group-perfect { flex-direction: column; border-radius: 20px; padding: 1.5rem; gap: 1rem; }
          .input-group-perfect input { width: 100%; text-align: center; margin: 0; }
          .btn-gold-sm { width: 100%; padding: 15px; }
        }
      `}</style>
    </div>
  );
};

export default Home;

