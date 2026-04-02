import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <header className="hero">
      <div className="container hero-content">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-text"
        >
          <span className="hero-subtitle">ESTD 1995</span>
          <h1 className="hero-title">
            Taste of <span className="italic">Home</span>, <br />
            Straight to <span className="text-accent">You.</span>
          </h1>
          <p className="hero-description">
            Handcrafted South Indian pickles made with love, tradition, and zero preservatives. 
            Experience the authentic flavors of generations.
          </p>
          <div className="hero-search">
            <input type="text" placeholder="Search for Prawns, Chicken or Veg pickles..." />
            <button className="btn-search">SEARCH</button>
          </div>
          <div className="hero-actions">
            <a href="#products" className="btn">EXPLORE PRODUCTS</a>
            <a href="#about" className="btn-secondary">OUR STORY</a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-image-container"
        >
          <div className="hero-image-glow"></div>
          {/* I will add the generated image here later */}
          <img 
            src="/hero-pickles.png" 
            alt="Artisanal Pickles" 
            className="hero-image"
          />
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;
