import React from 'react';
import { Alert } from '@/types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatDate, formatRelativeTime, getAlertTypeLabel, getAlertSeverityColor } from '@/utils/helpers';
import { Flame, Cloud, AlertTriangle, Wind, Thermometer, Radio, CheckCircle, Camera, Activity } from 'lucide-react';
import clsx from 'clsx';

interface AlertItemProps {
  alert: Alert;
  onResolve?: (alertId: string) => void;
  showImage?: boolean;
}

export const AlertItem: React.FC<AlertItemProps> = ({
  alert,
  onResolve,
  showImage = false,
}) => {
  const getAlertIcon = () => {
    const iconClass = "w-5 h-5";
    switch (alert.type) {
      case 'fire':
        return <Flame className={iconClass} />;
      case 'smoke':
        return <Cloud className={iconClass} />;
      case 'ppe_violation':
        return <AlertTriangle className={iconClass} />;
      case 'gas':
        return <Wind className={iconClass} />;
      case 'temperature':
        return <Thermometer className={iconClass} />;
      case 'motion':
        return <Radio className={iconClass} />;
      default:
        return <AlertTriangle className={iconClass} />;
    }
  };

  const getSeverityVariant = () => {
    switch (alert.severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div
      className={clsx(
        'p-4 border rounded-lg',
        alert.resolved
          ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
          : `border-2 ${getAlertSeverityColor(alert.severity)}`
      )}
    >
      <div className="flex items-start gap-4">
        {showImage && alert.imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={alert.imageUrl}
              alt="Alert"
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className={clsx(
                'p-2 rounded-lg',
                alert.resolved ? 'bg-gray-200 dark:bg-gray-800' : getAlertSeverityColor(alert.severity)
              )}>
                {getAlertIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {getAlertTypeLabel(alert.type)}
                  </h3>
                  <Badge variant={getSeverityVariant() as any} size="sm">
                    {alert.severity === 'critical' ? 'حرج' :
                     alert.severity === 'high' ? 'عالي' :
                     alert.severity === 'medium' ? 'متوسط' : 'منخفض'}
                  </Badge>
                  {alert.resolved && (
                    <Badge variant="success" size="sm">
                      <CheckCircle className="w-3 h-3 ml-1" />
                      تم الحل
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {alert.description}
                </p>
              </div>
            </div>

            {!alert.resolved && onResolve && (
              <Button
                size="sm"
                variant="success"
                onClick={() => onResolve(alert.id)}
                icon={<CheckCircle className="w-4 h-4" />}
              >
                حل التنبيه
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              {alert.sourceType === 'camera' ? (
                <Camera className="w-4 h-4" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              <span>{alert.sourceName}</span>
            </div>

            <div className="flex items-center gap-1">
              <span>•</span>
              <span title={formatDate(alert.timestamp)}>
                {formatRelativeTime(alert.timestamp)}
              </span>
            </div>

            {alert.resolved && alert.resolvedBy && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>تم الحل بواسطة: {alert.resolvedBy}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
