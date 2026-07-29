import { API_URL } from '../utils/constants';

export async function fetchNotifications() {
  try {
    const res = await fetch(`${API_URL}/notifications`);
    return await res.json();
  } catch (error) {
    console.error('Fetch notifications error', error);
    return [];
  }
}

export async function createNotification(notificationData) {
  try {
    const res = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    });
    return await res.json();
  } catch (error) {
    console.error('Create notification error', error);
    return { error: 'Network error' };
  }
}

export async function markNotificationAsRead(id) {
  try {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
    });
    return await res.json();
  } catch (error) {
    console.error('Mark notification as read error', error);
    return { error: 'Network error' };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const res = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
    });
    return await res.json();
  } catch (error) {
    console.error('Mark all notifications as read error', error);
    return { error: 'Network error' };
  }
}

export async function deleteNotification(id) {
  try {
    const res = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    console.error('Delete notification error', error);
    return { error: 'Network error' };
  }
}
