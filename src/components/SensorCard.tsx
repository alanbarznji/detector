import React from 'react';
import { Sensor as SensorType } from '@/types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { getSensorStatusColor, getSensorTypeLabel, isSensorValueInRange } from '@/utils/helpers';
import { useSensorData } from '@/hooks/useSensorData';
import { Activity, AlertTriangle, Thermometer, Wind, Radio, Droplets, Gauge } from 'lucide-react';

interface SensorCardProps {
  sensor: SensorType;
  onClick?: () => void;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor, onClick }) => {
  const { currentValue, isUpdating, isInRange } = useSensorData(sensor);
  const activeAlerts = sensor.alerts.filter(a => !a.resolved);

  const getStatusBadge = () => {
    switch (sensor.status) {
      case 'working':
        return <Badge variant="success" size="sm">يعمل</Badge>;
      case 'error':
        return <Badge variant="danger" size="sm">خطأ</Badge>;
      case 'disconnected':
        return <Badge variant="default" size="sm">غير متصل</Badge>;
      default:
        return null;
    }
  };

  const getSensorIcon = () => {
    const iconClass = "w-8 h-8";
    switch (sensor.type) {
      case 'temperature':
        return <Thermometer className={iconClass} />;
      case 'gas':
        return <Wind className={iconClass} />;
      case 'motion':
        return <Radio className={iconClass} />;
      case 'humidity':
        return <Droplets className={iconClass} />;
      case 'pressure':
        return <Gauge className={iconClass} />;
      default:
        return <Activity className={iconClass} />;
    }
  };

  const getValueColor = () => {
    if (sensor.status !== 'working') return 'text-gray-400';
    if (!isInRange) return 'text-danger-600 dark:text-danger-400';
    return 'text-success-600 dark:text-success-400';
  };

  const percentage = sensor.status === 'working'
    ? ((currentValue - sensor.minValue) / (sensor.maxValue - sensor.minValue)) * 100
    : 0;

  return (
    <Card className="overflow-hidden" hover>
      <div className="cursor-pointer" onClick={onClick}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getSensorStatusColor(sensor.status)}`}>
              {getSensorIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {sensor.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getSensorTypeLabel(sensor.type)}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {sensor.status === 'working' && (
          <>
            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">القراءة الحالية</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${getValueColor()}`}>
                    {currentValue}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {sensor.unit}
                  </span>
                  {isUpdating && (
                    <Activity className="w-4 h-4 text-primary-600 animate-pulse" />
                  )}
                </div>
              </div>

              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full transition-all duration-300 ${
                    isInRange ? 'bg-success-500' : 'bg-danger-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                />
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">
                  {sensor.minValue} {sensor.unit}
                </span>
                <span className="text-xs text-gray-400">
                  {sensor.maxValue} {sensor.unit}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">النطاق المسموح:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {sensor.threshold.min} - {sensor.threshold.max} {sensor.unit}
              </span>
            </div>
          </>
        )}

        {sensor.status === 'error' && (
          <div className="flex items-center gap-2 text-danger-600 dark:text-danger-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>يوجد خطأ في الحساس</span>
          </div>
        )}

        {sensor.status === 'disconnected' && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>الحساس غير متصل</span>
          </div>
        )}

        {activeAlerts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-danger-600 dark:text-danger-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {activeAlerts.length} تنبيه نشط
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
