import React from 'react';
import '../../styles/Skeleton.css';

export default function Skeleton({ variant = 'text', width = '100%', height, className = '' }) {
  const styles = {
    width,
    height: height || (variant === 'circle' ? width : variant === 'title' ? '1.8rem' : '1rem'),
  };

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={styles}
    />
  );
}
