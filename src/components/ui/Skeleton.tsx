import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-dark-card via-dark-lighter to-dark-card ${className}`} />
  );
};
