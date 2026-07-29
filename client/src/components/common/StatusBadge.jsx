import React from 'react';
import '../../styles/StatusBadge.css';

export default function StatusBadge({ status }) {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'active':
      case 'paid':
      case 'success':
        return 'badge-success';
      case 'pending':
      case 'processing':
      case 'warning':
        return 'badge-warning';
      case 'cancelled':
      case 'failed':
      case 'inactive':
      case 'error':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  return <span className={`status-badge ${getStatusClass()}`}>{status}</span>;
}
