import { useState, useEffect } from 'react';
import { Camera } from '@/types';

export const useCameraStream = (camera: Camera) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
