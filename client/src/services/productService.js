import { API_URL } from '../utils/constants';

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    return await res.json();
  } catch (error) {
    console.error('Fetch products error', error);
    return { success: false, error: 'Network error' };
  }
}
