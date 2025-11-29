import React from 'react';
import { Camera as CameraType } from '@/types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useCameraStream } from '@/hooks/useCameraStream';
import { getCameraStatusColor } from '@/utils/helpers';
import { Video, VideoOff, AlertTriangle, Flame, Cloud } from 'lucide-react';

interface CameraCardProps {
  camera: CameraType;
  onClick?: () => void;
  showControls?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  onClick,
  showControls = false,
}) => {
  const { isLoading } = useCameraStream(camera);
  const activeAlerts = camera.alerts.filter(a => !a.resolved);

  const getStatusBadge = () => {
    switch (camera.status) {
      case 'online':
        return <Badge variant="success" size="sm">متصل</Badge>;
      case 'offline':
        return <Badge variant="danger" size="sm">غير متصل</Badge>;
      case 'loading':
        return <Badge variant="warning" size="sm">جاري الاتصال</Badge>;
      default:
        return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return <Flame className="w-4 h-4" />;
      case 'smoke':
        return <Cloud className="w-4 h-4" />;
      case 'ppe_violation':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="overflow-hidden" padding="none" hover>
      <div
        className="cursor-pointer"
        onClick={onClick}
      >
        <div className="relative aspect-video bg-gray-900">
          {isLoading || camera.status === 'loading' ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : camera.status === 'offline' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <VideoOff className="w-12 h-12 mb-2" />
              <span className="text-sm">غير متصل</span>
            </div>
          ) : (
            <img
              src={camera.lastFrame}
              alt={camera.name}
              className="w-full h-full object-cover"
            />
          )}

          {activeAlerts.length > 0 && (
            <div className="absolute top-2 left-2 flex gap-1">
              {activeAlerts.slice(0, 3).map(alert => (
                <div
                  key={alert.id}
                  className="bg-danger-600 text-white p-1.5 rounded-full animate-pulse-slow"
                  title={alert.description}
                >
                  {getAlertIcon(alert.type)}
                </div>
              ))}
            </div>
          )}

          <div className="absolute bottom-2 right-2">
            {getStatusBadge()}
          </div>

          {camera.status === 'online' && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-1 bg-danger-600 text-white px-2 py-1 rounded text-xs">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {camera.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Video className="w-3 h-3" />
                {camera.location}
              </p>
            </div>
          </div>

          {activeAlerts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-danger-600 dark:text-danger-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {activeAlerts.length} تنبيه نشط
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
