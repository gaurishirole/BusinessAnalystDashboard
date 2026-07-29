import { API_URL } from '../utils/constants';

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (error) {
    console.error('Login error', error);
    return { success: false, error: 'Network error' };
  }
}
