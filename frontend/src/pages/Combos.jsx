import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Package, X, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import FoodCard from '../components/FoodCard';
import SEOHead from '../components/SEOHead';
import api from '../lib/api';
import { Link } from 'react-router-dom';

const Combos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch combos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);


  const comboProducts = useMemo(() => {
    return products.filter(product => {
      const isCombo = product.category.toLowerCase() === 'combo';
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return isCombo && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      return 0;
    });
  }, [searchQuery, sortBy]);

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      <SEOHead
        title="Heritage Combos | Venki's Foods"
        description="Experience the perfect pairings with our heritage combos."
      />

      <div className="container">

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="section-label">Curated Heritage Bundles</span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 7vw, 4rem)',
            lineHeight: 1.15,
            margin: '0.5rem 0 1rem'
          }}>
            The <span className="gold-text">Signature</span> Combos
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto',
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            lineHeight: 1.7,
            padding: '0 1rem'
          }}>
            We've paired our most loved recipes into sophisticated bundles — the perfect gift for heritage food lovers.
          </p>
        </div>

        {/* Controls Bar — compact single row */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--radius-md)',
          padding: '0.6rem 1rem'
        }}>
          {/* Search */}
          <Search size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search combos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              minWidth: 0
            }}
          />
          {searchQuery && (
            <X
              size={14}
              color="var(--text-secondary)"
              style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={() => setSearchQuery('')}
            />
          )}

          {/* Divider */}
          <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

          {/* Sort */}
          <SlidersHorizontal size={15} color="var(--primary-gold)" style={{ flexShrink: 0 }} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'inherit', fontWeight: 600,
              fontSize: '0.82rem', cursor: 'pointer',
              flexShrink: 0, maxWidth: '130px'
            }}
          >
            <option value="featured" style={{ background: '#050505' }}>Best Sellers</option>
            <option value="low-high" style={{ background: '#050505' }}>Low → High</option>
            <option value="high-low" style={{ background: '#050505' }}>High → Low</option>
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <Loader2 className="animate-spin" size={48} color="var(--primary-gold)" />
          </div>
        ) : comboProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: '1.5rem'
          }}>

            {comboProducts.map(product => (
              <FoodCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div
              className="glass-card"
              style={{
                maxWidth: '700px',
                margin: '0 auto',
                padding: 'clamp(3rem, 10vw, 5rem) clamp(1.5rem, 6vw, 3rem)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Package size={56} color="var(--primary-gold)" style={{ opacity: 0.3 }} />
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.6rem, 6vw, 2.5rem)',
                marginBottom: '1rem',
                lineHeight: 1.2
              }}>
                No Bundles <span className="gold-text">Found</span>
              </h3>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.05rem)',
                maxWidth: '380px',
                marginBottom: '2.5rem',
                lineHeight: 1.8,
                padding: '0 0.5rem'
              }}>
                Our curated signature bundles are being prepared with extra care.
                Explore our main menu for individual delicacies!
              </p>

              <Link
                to="/menu"
                className="btn btn-primary"
                style={{
                  borderRadius: '50px',
                  whiteSpace: 'nowrap',
                  padding: '0.9rem 2.5rem',
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)'
                }}
              >
                Browse Menu <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Combos;
