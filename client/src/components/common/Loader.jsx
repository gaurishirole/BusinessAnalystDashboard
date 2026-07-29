import React from 'react';
import '../../styles/Loader.css';

export default function Loader({ size = 'md', className = '' }) {
  return (
    <div className={`loader-container ${className}`}>
      <div className={`spinner spinner-${size}`} />
    </div>
  );
}
