import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TopProducts from '../../components/dashboard/TopProducts';
import { fetchProducts } from '../../services/productService';
import { useSearch } from '../../context/SearchContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useSearch();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && data.error) {
          setError(data.error);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.revenue || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Products">
      <div className="animate-fade-in">
        {loading ? (
          <div className="dashboard-loading animate-pulse">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="dashboard-error">
            <p>{error}</p>
          </div>
        ) : (
          <TopProducts data={filteredProducts} />
        )}
      </div>
    </DashboardLayout>
  );
}
