import { API_URL } from '../utils/constants';

export async function fetchReportData(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.category) params.append('category', filters.category);

    const res = await fetch(`${API_URL}/reports?${params.toString()}`);
    return await res.json();
  } catch (error) {
    console.error('Fetch report data error', error);
    return { success: false, error: 'Network error' };
  }
}
