import { API_URL } from '../utils/constants';

export async function fetchMessages() {
  try {
    const res = await fetch(`${API_URL}/messages`);
    return await res.json();
  } catch (error) {
    console.error('Fetch messages error', error);
    return [];
  }
}

export async function createMessage(messageData) {
  try {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    return await res.json();
  } catch (error) {
    console.error('Create message error', error);
    return { error: 'Network error' };
  }
}

export async function markMessageAsRead(id) {
  try {
    const res = await fetch(`${API_URL}/messages/${id}/read`, {
      method: 'PUT',
    });
    return await res.json();
  } catch (error) {
    console.error('Mark message as read error', error);
    return { error: 'Network error' };
  }
}

export async function updateMessageFolder(id, folder) {
  try {
    const res = await fetch(`${API_URL}/messages/${id}/folder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder }),
    });
    return await res.json();
  } catch (error) {
    console.error('Update message folder error', error);
    return { error: 'Network error' };
  }
}
