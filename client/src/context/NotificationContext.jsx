import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchNotifications as apiFetchNotifications,
  createNotification as apiCreateNotification,
  markNotificationAsRead as apiMarkNotificationAsRead,
  markAllNotificationsAsRead as apiMarkAllNotificationsAsRead,
  deleteNotification as apiDeleteNotification
} from '../services/notificationService';

const NotificationContext = createContext();

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const data = await apiFetchNotifications();
    if (Array.isArray(data)) {
      const mapped = data.map((n) => ({
        id: n.id,
        text: n.message,
        type: n.type,
        read: n.is_read,
        time: formatTimeAgo(n.created_at),
      }));
      setNotifications(mapped);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = async (text, type = 'info') => {
    const newNotif = await apiCreateNotification({ message: text, type });
    if (newNotif && !newNotif.error) {
      setNotifications((prev) => [
        {
          id: newNotif.id,
          text: newNotif.message,
          type: newNotif.type,
          read: newNotif.is_read,
          time: formatTimeAgo(newNotif.created_at),
        },
        ...prev,
      ]);
    }
  };

  const markAsRead = async (id) => {
    const updated = await apiMarkNotificationAsRead(id);
    if (updated && !updated.error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    await apiMarkAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = async (id) => {
    await apiDeleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
