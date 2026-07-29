import { API_URL } from '../utils/constants';

export async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/events`);
    return await res.json();
  } catch (error) {
    console.error('Fetch events error', error);
    return [];
  }
}

export async function createEvent(eventData) {
  try {
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return await res.json();
  } catch (error) {
    console.error('Create event error', error);
    return { error: 'Network error' };
  }
}

export async function updateEvent(id, eventData) {
  try {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return await res.json();
  } catch (error) {
    console.error('Update event error', error);
    return { error: 'Network error' };
  }
}

export async function deleteEvent(id) {
  try {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    console.error('Delete event error', error);
    return { error: 'Network error' };
  }
}
