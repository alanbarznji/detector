import { useState, useEffect } from 'react';

export const useCameraStream = (camera) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (camera.status === 'offline') {
      setIsLoading(false);
      setError('الكاميرا غير متصلة');
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [camera.status]);

  return { isLoading, error };
};
