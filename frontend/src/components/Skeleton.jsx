import React from 'react';
import './Skeleton.css';

export const SkeletonBox = ({ width, height, borderRadius = '8px', className = '' }) => {
  return (
    <div 
      className={`skeleton-box ${className}`} 
      style={{ width, height, borderRadius }}
    />
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton-image-wrap">
        <SkeletonBox width="100%" height="250px" borderRadius="15px" />
      </div>
      <div className="product-info-skeleton">
        <SkeletonBox width="40%" height="15px" className="mb-4" />
        <SkeletonBox width="80%" height="24px" className="mb-4" />
        <div className="flex justify-between items-center mt-6">
          <SkeletonBox width="30%" height="20px" />
          <SkeletonBox width="40px" height="40px" borderRadius="10px" />
        </div>
      </div>
    </div>
  );
};
