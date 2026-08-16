import React from 'react';
import '../styles/skeleton.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image skeleton-pulse"></div>
      <div className="skeleton-content">
        <div className="skeleton-meta">
          <div className="skeleton-tag skeleton-pulse"></div>
          <div className="skeleton-date skeleton-pulse"></div>
        </div>
        <div className="skeleton-title skeleton-pulse"></div>
        <div className="skeleton-text skeleton-pulse"></div>
        <div className="skeleton-text skeleton-text-short skeleton-pulse"></div>
        <div className="skeleton-footer">
          <div className="skeleton-avatar skeleton-pulse"></div>
          <div className="skeleton-author skeleton-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
