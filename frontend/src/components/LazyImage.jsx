import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage.jsx
 * - Props: src, alt, className.
 * - Use IntersectionObserver with rootMargin 150px.
 * - Before intersection: show placeholder.
 * - After intersection: load image, fade in on load.
 */
const LazyImage = ({ src, alt, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '150px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={imgRef} 
      className={`lazy-image-container ${className} ${isLoaded ? 'loaded' : 'loading'}`}
    >
      {!isLoaded && <div className="skeleton skeleton-image-placeholder"></div>}
      
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            // On broken image: show a branded dark placeholder
            e.target.style.display = 'none';
            setIsLoaded(true);
          }}
          className={`lazy-img ${isLoaded ? 'visible' : 'hidden'}`}
        />
      )}

      <style>{`
        .lazy-image-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
        }
        .skeleton-image-placeholder {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
        }
        .lazy-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.5s ease;
        }
        .lazy-img.hidden { opacity: 0; }
        .lazy-img.visible { opacity: 1; }
      `}</style>
    </div>
  );
};

export default LazyImage;
