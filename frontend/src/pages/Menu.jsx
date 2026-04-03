import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import SEOHead from '../components/SEOHead';
import productsData from '../data/products.json';
import api from '../lib/api';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState(productsData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); 
  const [showFilters, setShowFilters] = useState(false);

  // Venki's Foods Specific Categories
  const categories = ['All', 'Podi', 'Thokku & Kulambu', 'Pickle', 'Combo'];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search Match
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      // 2. Category Match (Special handling for Thokku & Kulambu grouping)
      let matchesCategory = activeCategory === 'All';
      if (!matchesCategory) {
        if (activeCategory === 'Thokku & Kulambu') {
          matchesCategory = product.category === 'thokku' || product.category === 'kulambu';
        } else {
          matchesCategory = product.category.toLowerCase() === activeCategory.toLowerCase();
        }
      }

      // 3. Veg Match
      const matchesVeg = !vegOnly || product.is_veg;
      
      return matchesSearch && matchesCategory && matchesVeg;
    }).sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      return 0; // featured
    });
  }, [products, searchQuery, activeCategory, vegOnly, sortBy]);


  // Sync state with URL if it changes externally
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  // HYDRATION: Sync with live database in background
  useEffect(() => {
    const syncLiveProducts = async () => {
      try {
        const { data } = await api.get('/products');
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.warn("Menu Hydration: Sync failed, using local JSON.");
      }
    };
    syncLiveProducts();
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearchParams({ category: cat });
    if (window.innerWidth < 768) setShowFilters(false);
  };

  return (
    <div className="menu-page container py-4 md:py-8 mobile-pt-6">
      <SEOHead 
        title="Our Menu | Artisanal Pickles & Condiments" 
        description="Explore our range of traditional mango, lemon, garlic, and meat pickles. High quality, zero preservatives, 100% authentic flavor." 
      />

      <div className="menu-header">
        <h1 className="section-title">Explore Our <span>Heritage Menu</span></h1>
        <p className="menu-subtitle">Found {filteredProducts.length} delicious items for you.</p>
      </div>

      {/* Control Bar */}
      <div className="menu-controls glass-card">
        {/* Search */}
        <div className="search-box">
          <Search size={20} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search pickles, spices, tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && <X size={18} className="clear-search" onClick={() => setSearchQuery('')} />}
        </div>

        {/* Desktop Controls */}
        <div className="desktop-controls">
          <div className="veg-toggle" onClick={() => setVegOnly(!vegOnly)}>
            <div className={`toggle-btn ${vegOnly ? 'active' : ''}`}>
              <div className="toggle-dot"></div>
            </div>
            <span>Veg Only</span>
          </div>

          <div className="sort-dropdown">
            <SlidersHorizontal size={18} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <button className="mobile-filter-btn btn btn-secondary" onClick={() => setShowFilters(true)}>
          <SlidersHorizontal size={18} /> Filters
        </button>
      </div>

      <div className="menu-layout">
        {/* Sidebar Filters */}
        <aside className={`menu-sidebar ${showFilters ? 'mobile-visible' : ''}`}>
          <div className="sidebar-content glass-card">
            <div className="sidebar-header">
              <h3>Categories</h3>
              <button className="close-filters" onClick={() => setShowFilters(false)}><X size={20}/></button>
            </div>
            <div className="category-list">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`cat-item ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                  {activeCategory === cat && <Check size={16} />}
                </button>
              ))}
            </div>

            <div className="sidebar-divider"></div>

            <div className="sidebar-mobile-only">
               <h3>Preferences</h3>
               <div className="veg-toggle mt-4" onClick={() => setVegOnly(!vegOnly)}>
                <div className={`toggle-btn ${vegOnly ? 'active' : ''}`}>
                  <div className="toggle-dot"></div>
                </div>
                <span>Veg Only</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="menu-main">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-3">
              {filteredProducts.map(product => (
                <FoodCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-results glass-card">
              <Search size={48} opacity={0.3} />
              <h3>No items found</h3>
              <p>Try adjusting your search or category filters.</p>
              <button className="btn btn-primary mt-4" onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setVegOnly(false);
              }}>Clear All Filters</button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .menu-header { margin-bottom: 3rem; }
        .menu-subtitle { color: var(--text-secondary); margin-top: 0.5rem; }
        
        .menu-controls {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start; /* Align search on left, controls next to it */
          padding: 1.2rem 2rem;
          margin-bottom: 3rem;
          gap: 2.5rem;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          padding: 12px 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-glass);
          max-width: 450px; /* Keep search box compact */
        }
        .search-box input {
          width: 100%;
          background: none;
          border: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 1rem;
        }
        .search-box input:focus { outline: none; }
        .clear-search { cursor: pointer; color: var(--text-secondary); }

        .desktop-controls { 
          display: flex; 
          align-items: center; 
          gap: 3rem; 
          flex-shrink: 0;
          margin-left: auto; /* Push to the far right */
        }
        
        .veg-toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .toggle-btn {
          width: 36px; height: 18px;
          background: #e2e8f0;
          border-radius: 10px;
          position: relative;
          transition: 0.3s;
        }
        .toggle-btn.active { background: var(--success); }
        .toggle-dot {
          width: 14px; height: 14px;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 2px; left: 2px;
          transition: 0.3s;
        }
        .toggle-btn.active .toggle-dot { transform: translateX(18px); }

        .sort-dropdown { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); }
        .sort-dropdown select {
          background: none;
          border: none;
          color: var(--text-primary);
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        .sort-dropdown select:focus { outline: none; }

        .menu-layout { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; }
        
        .menu-sidebar .sidebar-content { padding: 2rem; position: sticky; top: 100px; }
        .sidebar-header { display: flex; justify-content: space-between; items-center; margin-bottom: 2rem; }
        .close-filters { display: none; }
        
        .category-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .cat-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 18px;
          border-radius: var(--radius-md);
          font-weight: 600;
          color: var(--text-secondary);
          transition: 0.3s;
        }
        .cat-item:hover { background: rgba(0,0,0,0.03); color: var(--text-primary); }
        .cat-item.active { background: var(--primary-glow); color: var(--primary-gold); }
        
        .sidebar-divider { height: 1px; background: var(--border-glass); margin: 2rem 0; }
        .sidebar-mobile-only { display: none; }

        .grid-3 { grid-template-columns: repeat(3, 1fr); display: grid; gap: 2rem; }
        
        .no-results {
          padding: 5rem;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 1rem;
        }

        .mobile-filter-btn { display: none; }

        @media (max-width: 1200px) {
          .grid-3 { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 991px) {
          .menu-layout { grid-template-columns: 1fr; }
          .menu-sidebar { display: none; }
        }

        @media (max-width: 768px) {
          .menu-controls { padding: 1rem; gap: 1rem; }
          .search-box { flex: 1.5; min-width: 140px; }
          .mobile-filter-btn { flex: 1; padding: 10px; font-size: 0.9rem; }
          .desktop-controls { display: none; }
          .mobile-filter-btn { display: flex; }
          .grid-3 { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          
          .menu-sidebar.mobile-visible {
            display: block;
            position: fixed;
            inset: 0; z-index: 2000;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(10px);
            padding: 2rem;
          }
          .mobile-visible .sidebar-content { height: 100%; border: none; background: none; }
          .close-filters { display: block; color: #fff; }
          .sidebar-mobile-only { display: block; }
        }
      `}</style>
    </div>
  );
};

export default Menu;
