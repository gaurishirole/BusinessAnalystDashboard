import React from 'react';
import '../../styles/TopProducts.css';
import { Star } from 'lucide-react';

export default function TopProducts({ data = [] }) {
  return (
    <div className="top-products-card glass-panel">
      <div className="card-header">
        <h3>Top Products</h3>
        <p>Highest performing offerings</p>
      </div>
      <div className="products-list">
        {data.map((product) => (
          <div key={product.id} className="product-row">
            <div className="product-info-left">
              <span className="product-name">{product.name}</span>
              <div className="product-rating">
                <Star size={12} fill="var(--color-warning)" stroke="var(--color-warning)" />
                <span>{product.rating}</span>
              </div>
            </div>
            <div className="product-stats-right">
              <span className="product-sales">{product.sales} sales</span>
              <span className="product-revenue">{product.revenue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
