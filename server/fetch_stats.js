async function fetchStats() {
  try {
    const res = await fetch('http://localhost:5000/api/dashboard/stats');
    const data = await res.json();
    console.log('Stats keys:', Object.keys(data));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
fetchStats();
