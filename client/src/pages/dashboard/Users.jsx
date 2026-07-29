import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { useSearch } from '../../context/SearchContext';

const users = [
  { id: 1, name: 'Alex Mercer', email: 'alex@insightpro.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Sarah Connor', email: 'sarah@insightpro.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'John Doe', email: 'john@insightpro.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Emma Watson', email: 'manager@insightpro.com', role: 'Manager', status: 'Active' },
  { id: 5, name: 'Robert Downey', email: 'analyst@insightpro.com', role: 'Analyst', status: 'Active' },
];

export default function Users() {
  const { searchQuery } = useSearch();

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Users">
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3>Administrative Users</h3>
        <div className="table-responsive">
          <table className="orders-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="customer-name">{u.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ fontWeight: 500 }}>{u.role}</td>
                  <td>
                    <StatusBadge status={u.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
