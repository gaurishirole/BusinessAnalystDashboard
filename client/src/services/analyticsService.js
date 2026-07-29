import { API_URL } from '../utils/constants';

export async function fetchAnalyticsStats() {
  try {
    const res = await fetch(`${API_URL}/analytics`);
    return await res.json();
  } catch (error) {
    console.error('Fetch analytics stats error', error);
    return { success: false, error: 'Network error' };
  }
}
