import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, FlaskConical, Clock } from 'lucide-react';
import '../styles/About.css';

const About = () => {
  const values = [
    { 
      icon: <Heart />, 
      title: "100% Homemade", 
      desc: "Every jar is prepared by hand in small batches, ensuring tradition and quality in every bite." 
    },
    { 
      icon: <FlaskConical />, 
      title: "No Preservatives", 
      desc: "We use only natural ingredients. No artificial colors or chemicals, just pure nature." 
    },
    { 
      icon: <Shield />, 
      title: "Authentic Recipes", 
      desc: "Our recipes have been passed down through generations, preserving the original South Indian taste." 
    },
    { 
      icon: <Clock />, 
      title: "Fresh & Refrigerated", 
      desc: "Made fresh to order and stored under optimal conditions to maintain peak flavor." 
    }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-header">
          <span className="subtitle">OUR PROMISE</span>
          <h2 className="title">The Venki's <span className="italic text-accent">Difference</span></h2>
          <p className="description">
            We believe food should tell a story. Ours is one of tradition, love, and a commitment to the very best ingredients.
          </p>
        </div>

        <div className="values-grid">
          {values.map((v, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="value-card"
            >
              <div className="value-icon">{v.icon}</div>
              <h3 className="value-title">{v.title}</h3>
              <p className="value-desc">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="about-stats">
          <div className="stat-item">
            <span className="stat-num">7+</span>
            <span className="stat-label">Signature Products</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num">100%</span>
            <span className="stat-label">Homemade</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num">2000+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
