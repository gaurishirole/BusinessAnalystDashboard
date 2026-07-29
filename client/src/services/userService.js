import { API_URL } from '../utils/constants';

export async function fetchUsers() {
  try {
    const res = await fetch(`${API_URL}/users`);
    return await res.json();
  } catch (error) {
    console.error('Fetch users error', error);
    return { success: false, error: 'Network error' };
  }
}

export async function updateUserProfile(userData) {
  try {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (error) {
    console.error('Update profile error', error);
    return { success: false, error: 'Network error' };
  }
}
