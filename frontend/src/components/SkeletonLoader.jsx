import React from 'react';
import '../styles/components/SkeletonLoader.css';

const SkeletonLoader = ({ 
  width = '100%', 
  height = '1rem', 
  borderRadius = '0.375rem',
  className = '' 
}) => {
  return (
    <div 
      className={`skeleton-loader ${className}`}
      style={{ 
        width, 
        height, 
        borderRadius 
      }}
    />
  );
};

export const SkillCardSkeleton = () => (
  <div className="skill-card-skeleton">
    <div className="skill-card-skeleton__header">
      <SkeletonLoader width="60%" height="1rem" />
      <SkeletonLoader width="30%" height="0.75rem" />
    </div>
    <SkeletonLoader width="40%" height="0.75rem" />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="dashboard-skeleton">
    <div className="dashboard-skeleton__header">
      <SkeletonLoader width="300px" height="2rem" />
      <SkeletonLoader width="400px" height="1rem" />
    </div>
    
    <div className="dashboard-skeleton__grid">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="dashboard-skeleton__card">
          <div className="dashboard-skeleton__card-header">
            <SkeletonLoader width="40px" height="40px" borderRadius="10px" />
            <div>
              <SkeletonLoader width="120px" height="1rem" />
              <SkeletonLoader width="80px" height="0.75rem" />
            </div>
          </div>
          <div className="dashboard-skeleton__card-content">
            {[...Array(3)].map((_, j) => (
              <SkillCardSkeleton key={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonLoader;