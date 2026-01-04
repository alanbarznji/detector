import { useState, useEffect } from 'react';
import { getSocket } from '../store/middleware/socketMiddleware';

export const useCameraStream = (camera) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveFrame, setLiveFrame] = useState(null);
  const [hlsUrl, setHlsUrl] = useState(null);

  useEffect(() => {
    if (!camera || camera.status === 'offline') {
      setIsLoading(false);
      setError('الكاميرا غير متصلة');
      setLiveFrame(null);
      setHlsUrl(null);
      return;
    }

    const socket = getSocket();
    if (!socket) {
      // إذا Socket غير متصل، استخدم الصورة الثابتة
      setIsLoading(false);
      return;
    }

    // الاشتراك في بث الكاميرا
    socket.emit('detection:subscribe', { cameraId: camera.id });
    setIsLoading(true);

    // استقبال الإطارات المباشرة
    const handleFrame = (data) => {
      if (data.cameraId === camera.id) {
        setLiveFrame(data.frame);
        setIsLoading(false);
      }
    };

    const handleStatus = (data) => {
      if (data.cameraId === camera.id) {
        if (data.status === 'offline') {
          setError('الكاميرا غير متصلة');
          setLiveFrame(null);
          setHlsUrl(null);
        } else if (data.status === 'online' && data.streamType === 'hls' && data.hlsUrl) {
          // HLS stream is available
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
          setHlsUrl(`${backendUrl}${data.hlsUrl}`);
          setIsLoading(false);
        }
      }
    };

    socket.on('camera:frame', handleFrame);
    socket.on('camera:status', handleStatus);

    // تحديد مهلة زمنية للتحميل
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // تنظيف عند الخروج
    return () => {
      clearTimeout(timeout);
      socket.off('camera:frame', handleFrame);
      socket.off('camera:status', handleStatus);
      socket.emit('detection:unsubscribe', { cameraId: camera.id });
    };
  }, [camera?.id, camera?.status]);

  return {
    isLoading,
    error,
    // إرجاع الإطار المباشر إذا موجود، وإلا الصورة الثابتة
    currentFrame: liveFrame || camera?.lastFrame,
    // HLS URL if available
    hlsUrl,
    // Check if HLS is available
    isHLS: !!hlsUrl
  };
};
