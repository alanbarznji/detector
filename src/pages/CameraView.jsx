import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AlertItem } from '../components/AlertItem';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { resolveAlert } from '../store/slices/alertSlice';
import { useCameraStream } from '../hooks/useCameraStream';
import {
  ArrowLeft,
  Video,
  Camera as CameraIcon,
  Eye,
  Download,
  Maximize2,
  Play,
  Pause,
  RotateCw,
  AlertTriangle,
  Flame,
  Cloud,
  Shield
} from 'lucide-react';
import { getCameraStatusColor, getDetectionTypeLabel, getDetectionTypeBadgeColor } from '../utils/helpers';

export const CameraView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const camera = useAppSelector((state) =>
    state.cameras.items.find(c => c.id === id)
  );
  const alerts = useAppSelector((state) =>
    state.alerts.items.filter(a => a.sourceId === id)
  );

  const { isLoading, currentFrame } = useCameraStream(camera);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const user = { name: 'أحمد محمد', role: 'admin' };

  if (!camera) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <CameraIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            الكاميرا غير موجودة
          </h2>
          <Button onClick={() => navigate('/cameras')} variant="primary">
            العودة للكاميرات
          </Button>
        </div>
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  const handleResolveAlert = (alertId) => {
    dispatch(resolveAlert({ id: alertId, resolvedBy: user.name }));
  };

  const handleSnapshot = () => {
    console.log('Taking snapshot...');
    // Backend will handle this
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/cameras')}
          >
            رجوع
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {camera.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
              <Video className="w-4 h-4" />
              {camera.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={camera.status === 'online' ? 'success' : 'danger'} size="lg">
            {camera.status === 'online' ? 'متصل' : 'غير متصل'}
          </Badge>
        </div>
      </div>

      {/* Video Feed */}
      <Card padding="none" className="overflow-hidden">
        <div className={`relative bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}>
          {isLoading || camera.status === 'loading' ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner size="lg" />
              <div className="absolute bottom-4 text-white">جاري الاتصال بالكاميرا...</div>
            </div>
          ) : camera.status === 'offline' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <Video className="w-20 h-20 mb-4" />
              <span className="text-xl">الكاميرا غير متصلة</span>
            </div>
          ) : (
            <>
              <img
                src={currentFrame}
                alt={camera.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // إذا فشل تحميل البث المباشر، استخدم الصورة الثابتة
                  e.target.src = camera.lastFrame || 'https://placehold.co/1920x1080/1e40af/ffffff?text=Live+Camera+Feed';
                }}
              />

              {/* Live Indicator */}
              {camera.status === 'online' && isPlaying && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 bg-danger-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                </div>
              )}

              {/* Detection Active */}
              {camera.isDetectionActive && (
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span>الكشف نشط</span>
                  </div>
                </div>
              )}

              {/* Active Alerts Overlay */}
              {activeAlerts.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-danger-600/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-bold">{activeAlerts.length} تنبيه نشط</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {activeAlerts.slice(0, 3).map(alert => (
                        <div key={alert.id} className="text-sm flex items-center gap-2">
                          {alert.type === 'fire' && <Flame className="w-4 h-4" />}
                          {alert.type === 'smoke' && <Cloud className="w-4 h-4" />}
                          {alert.type === 'ppe_violation' && <Shield className="w-4 h-4" />}
                          <span>{alert.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Controls Overlay */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? 'إيقاف' : 'تشغيل'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={handleSnapshot}
                >
                  لقطة
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Maximize2 className="w-4 h-4" />}
                  onClick={handleToggleFullscreen}
                >
                  {isFullscreen ? 'خروج' : 'ملء الشاشة'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Camera Info & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Details */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            معلومات الكاميرا
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">الاسم</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{camera.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">الموقع</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{camera.location}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">الحالة</span>
              <div className="mt-1">
                <Badge variant={camera.status === 'online' ? 'success' : 'danger'}>
                  {camera.status === 'online' ? 'متصل' : 'غير متصل'}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">قدرات الكشف</span>
              <div className="flex flex-wrap gap-2">
                {camera.detectionCapabilities?.map((type) => (
                  <Badge
                    key={type}
                    variant="primary"
                    className={getDetectionTypeBadgeColor(type)}
                  >
                    {getDetectionTypeLabel(type)}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">الكشف التلقائي</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {camera.isDetectionActive ? '✅ نشط' : '❌ متوقف'}
              </p>
            </div>
          </div>
        </Card>

        {/* Active Alerts */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              التنبيهات النشطة ({activeAlerts.length})
            </h2>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>لا توجد تنبيهات نشطة</p>
              </div>
            ) : (
              activeAlerts.map(alert => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onResolve={handleResolveAlert}
                />
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            التنبيهات المحلولة ({resolvedAlerts.length})
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {resolvedAlerts.map(alert => (
              <AlertItem
                key={alert.id}
                alert={alert}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
