import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../../components/common/Button';

export default function Notifications() {
  const { notifications, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <DashboardLayout title="Notifications">
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Notification Center</h3>
          <Button variant="secondary" size="sm" onClick={markAllAsRead}>Mark All Read</Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className="glass-panel"
              style={{
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: !n.read ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-tertiary)'
              }}
            >
              <div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{n.text}</p>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{n.time}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteNotification(n.id)}>Dismiss</Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
