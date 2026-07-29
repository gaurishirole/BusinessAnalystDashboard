import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RecentOrders from '../../components/dashboard/RecentOrders';
import { fetchOrders } from '../../services/orderService';
import { useSearch } from '../../context/SearchContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useSearch();

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchOrders();
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && data.error) {
          setError(data.error);
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    (o.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.product || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.status || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(o.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Orders">
      <div className="animate-fade-in">
        {loading ? (
          <div className="dashboard-loading animate-pulse">
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div className="dashboard-error">
            <p>{error}</p>
          </div>
        ) : (
          <RecentOrders data={filteredOrders} />
        )}
      </div>
    </DashboardLayout>
  );
}
