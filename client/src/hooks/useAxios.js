import { useState, useEffect } from 'react';

// Custom hook to simulate API calls with mock delay and standard response structure
export default function useAxios({ url, method = 'GET', initialData = null }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Mocking an async request
    const timer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
        setData(initialData);
      }
    }, 800);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [url]);

  return { data, loading, error };
}
