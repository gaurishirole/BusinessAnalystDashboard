import React from 'react';
import '../../styles/EmptyState.css';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', message = 'There is nothing to display here at the moment.' }) {
  return (
    <div className="empty-state-container glass-panel">
      <Inbox size={48} className="empty-state-icon" />
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-message">{message}</p>
    </div>
  );
}
