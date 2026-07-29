import { API_URL } from '../utils/constants';

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_URL}/orders`);
    return await res.json();
  } catch (error) {
    console.error('Fetch orders error', error);
    return { success: false, error: 'Network error' };
  }
}
