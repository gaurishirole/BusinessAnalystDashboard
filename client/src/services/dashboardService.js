import { API_URL } from '../utils/constants';

export async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_URL}/dashboard/stats`);
    return await res.json();
  } catch (error) {
    console.error('Fetch dashboard stats error', error);
    return { success: false, error: 'Network error' };
  }
}
