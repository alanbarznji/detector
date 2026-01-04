import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { AlertTriangle } from 'lucide-react';

export const HLSPlayer = ({
  hlsUrl,
  camera,
  className = '',
  autoPlay = true,
  muted = true,
  controls = false,
  onError = null
}) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hlsUrl || !videoRef.current) {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;

    // Check if HLS is supported
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        maxFragLookUpTolerance: 0.25,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: Infinity,
        liveDurationInfinity: false,
        liveBackBufferLength: 0,
        maxLiveSyncPlaybackRate: 1,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded successfully');
        setIsLoading(false);
        if (autoPlay) {
          video.play().catch(err => {
            console.warn('Autoplay failed:', err);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Fatal network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Fatal media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error, cannot recover');
              setError('فشل تحميل البث المباشر');
              if (onError) onError(data);
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      };
    }
    // HLS.js is not supported on platforms that support HLS natively (like Safari)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        console.log('Native HLS loaded successfully');
        setIsLoading(false);
        if (autoPlay) {
          video.play().catch(err => {
            console.warn('Autoplay failed:', err);
          });
        }
      });
      video.addEventListener('error', (e) => {
        console.error('Native HLS error:', e);
        setError('فشل تحميل البث المباشر');
        if (onError) onError(e);
      });
    }
    else {
      setError('المتصفح لا يدعم تشغيل HLS');
      setIsLoading(false);
    }
  }, [hlsUrl, autoPlay, onError]);

  if (error) {
    return (
      <div className={`relative bg-gray-900 flex flex-col items-center justify-center ${className}`}>
        <AlertTriangle className="w-12 h-12 text-danger-500 mb-2" />
        <span className="text-white text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <LoadingSpinner size="lg" />
          <div className="absolute bottom-4 text-white text-sm">جاري تحميل البث المباشر...</div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={muted}
        controls={controls}
        playsInline
      />
    </div>
  );
};
