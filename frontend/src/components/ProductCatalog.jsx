import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Loader2, Plus, Search, ArrowUpDown, X } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { ProductSkeleton } from './Skeleton';
import { staticProducts } from '../utils/staticData';
import { Link } from 'react-router-dom';
import '../styles/ProductCatalog.css';

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  React.useEffect(() => {
    // Artificial delay to show off the premium skeletons
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  // Advanced Filtering & Sorting Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...staticProducts];

    // 1. Category Filter
    if (filter !== 'all') {
      result = result.filter(p => (p.category || '').toLowerCase() === filter.toLowerCase());
    }

    // 2. Search Filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }

    // 3. Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Keep original order
        break;
    }

    return result;
  }, [filter, searchTerm, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="products" className="products-section">
      <div className="container">
        
        {/* Header & Controls */}
        <div className="catalog-header-area">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="subtitle">ARTISANAL COLLECTION</span>
            <h2 className="title">Nature's <span className="italic text-accent">Finest</span> Preservation</h2>
          </motion.div>

          {/* Search & Sort Bar */}
          <div className="catalog-controls glass-card">
            <div className="search-box-premium">
              <Search size={20} className="search-icon-dim" />
              <input 
                type="text" 
                placeholder="Search flavors, ingredients..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <X size={18} className="clear-search" onClick={() => setSearchTerm('')} />}
            </div>

            <div className="controls-right-group">
              <div className="filter-tabs-mini">
                {['all', 'veg', 'non-veg'].map((cat) => (
                  <button 
                    key={cat}
                    className={`filter-tab-mini ${filter === cat ? 'active' : ''}`}
                    onClick={() => setFilter(cat)}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="sort-dropdown-wrap">
                <ArrowUpDown size={16} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <motion.div 
          className="products-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <AnimatePresence mode='popLayout'>
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <motion.div key={`skeleton-${i}`} variants={itemVariants}>
                  <ProductSkeleton />
                </motion.div>
              ))
            ) : filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="product-card-wrapper"
                >
                  <div className="product-card glass-card">
                    <div className="product-image-wrap">
                      {product.tag && <span className="product-tag gold-gradient-bg">{product.tag}</span>}
                      <Link to={`/product/${product.id}`}>
                        <img src={product.image} alt={product.name} className="product-image" />
                      </Link>
                      <div className="product-overlay">
                        <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                          <ShoppingCart size={18} />
                          ADD TO BOX
                        </button>
                      </div>
                    </div>

                    <div className="product-info">
                      <div className="product-meta">
                        <span className="product-category-label">{product.category}</span>
                        <div className="product-rating">
                          <Star size={14} fill="var(--accent-color)" color="var(--accent-color)" />
                          <span>{product.rating || '4.8'}</span>
                        </div>
                      </div>
                      <Link to={`/product/${product.id}`} className="hover-text-accent">
                        <h3 className="product-name">{product.name}</h3>
                      </Link>
                      <div className="product-footer">
                        <div className="price-block">
                          <span className="currency">₹</span>
                          <span className="amount">{product.price}</span>
                        </div>
                        <button className="icon-buy-btn gold-gradient-bg" onClick={() => handleAddToCart(product)}>
                          <Plus size={20} color="white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="empty-results col-span-full text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="empty-icon gold-gradient-bg mx-auto mb-6">
                  <Search size={40} color="white" />
                </div>
                <h3>No flavors found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                  className="btn btn-primary mt-6"
                  onClick={() => { setSearchTerm(''); setFilter('all'); setSortBy('featured'); }}
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductCatalog;
