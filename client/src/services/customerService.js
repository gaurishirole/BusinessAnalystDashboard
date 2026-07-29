import { API_URL } from '../utils/constants';

export async function fetchCustomers() {
  try {
    const res = await fetch(`${API_URL}/customers`);
    return await res.json();
  } catch (error) {
    console.error('Fetch customers error', error);
    return { success: false, error: 'Network error' };
  }
}
