import { useState, useEffect } from 'react';

const usePageBackground = (pageName) => {
  const [background, setBackground] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/backgrounds/${pageName}`
        );
        const data = await response.json();
        
        if (data.success) {
          setBackground(data.data);
        } else {
          setBackground(null);
        }
      } catch (err) {
        console.error('Error fetching page background:', err);
        setError(err);
        setBackground(null);
      } finally {
        setLoading(false);
      }
    };

    if (pageName) {
      fetchBackground();
    }
  }, [pageName]);

  return { background, loading, error };
};

export default usePageBackground;
