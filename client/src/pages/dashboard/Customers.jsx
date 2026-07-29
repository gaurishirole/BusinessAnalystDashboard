import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import { fetchCustomers } from '../../services/customerService';
import { useSearch } from '../../context/SearchContext';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await fetchCustomers();
        if (Array.isArray(data)) {
          setCustomers(data);
        } else if (data && data.error) {
          setError(data.error);
        } else {
          setError('Failed to load customers');
        }
      } catch (err) {
        setError('Error fetching customers');
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);
  
  const filtered = customers.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Customers">
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h3>Customer Directory</h3>
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search customers..." />
        </div>

        {loading ? (
          <div className="dashboard-loading animate-pulse">
            <p>Loading customers...</p>
          </div>
        ) : error ? (
          <div className="dashboard-error">
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No customers match your search" />
        ) : (
          <div className="table-responsive">
            <table className="orders-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Spent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td className="customer-name">{c.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.email}</td>
                    <td>{c.company}</td>
                    <td style={{ fontWeight: 600 }}>{c.spent}</td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
