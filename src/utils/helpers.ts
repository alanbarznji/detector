import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Alert, Camera, Sensor } from '@/types';

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ar });
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: ar });
};

export const getCameraStatusColor = (status: string): string => {
  switch (status) {
    case 'online':
      return 'text-success-500 bg-success-50 dark:bg-success-900/20';
    case 'offline':
      return 'text-danger-500 bg-danger-50 dark:bg-danger-900/20';
    case 'loading':
      return 'text-warning-500 bg-warning-50 dark:bg-warning-900/20';
    default:
      return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  }
};

export const getSensorStatusColor = (status: string): string => {
  switch (status) {
    case 'working':
      return 'text-success-500 bg-success-50 dark:bg-success-900/20';
    case 'error':
      return 'text-danger-500 bg-danger-50 dark:bg-danger-900/20';
    case 'disconnected':
      return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    default:
      return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  }
};

export const getAlertSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'text-danger-700 bg-danger-100 dark:bg-danger-900/30 border-danger-200';
    case 'high':
      return 'text-warning-700 bg-warning-100 dark:bg-warning-900/30 border-warning-200';
    case 'medium':
      return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200';
    case 'low':
      return 'text-blue-700 bg-blue-100 dark:bg-blue-900/30 border-blue-200';
    default:
      return 'text-gray-700 bg-gray-100 dark:bg-gray-900/30 border-gray-200';
  }
};

export const getAlertTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    fire: 'حريق',
    smoke: 'دخان',
    ppe_violation: 'مخالفة معدات السلامة',
    gas: 'تسرب غاز',
    temperature: 'حرارة عالية',
    motion: 'حركة غير مصرح بها',
  };
  return labels[type] || type;
};

export const getSensorTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    gas: 'غاز',
    temperature: 'حرارة',
    motion: 'حركة',
    humidity: 'رطوبة',
    pressure: 'ضغط',
  };
  return labels[type] || type;
};

export const exportToCSV = (data: Alert[], filename: string = 'alerts.csv') => {
  const headers = ['التاريخ', 'النوع', 'المصدر', 'الوصف', 'الحالة', 'تم الحل بواسطة'];

  const rows = data.map(alert => [
    formatDate(alert.timestamp),
    getAlertTypeLabel(alert.type),
    alert.sourceName,
    alert.description,
    alert.resolved ? 'تم الحل' : 'نشط',
    alert.resolvedBy || '-',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const getGridCols = (layout: string): string => {
  switch (layout) {
    case '1x1':
      return 'grid-cols-1';
    case '2x2':
      return 'grid-cols-1 md:grid-cols-2';
    case '3x3':
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case '4x4':
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    default:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }
};

export const isSensorValueInRange = (sensor: Sensor): boolean => {
  return sensor.currentValue >= sensor.threshold.min && sensor.currentValue <= sensor.threshold.max;
};

export const getActiveAlerts = (items: Camera[] | Sensor[]): number => {
  return items.reduce((count, item) => {
    return count + item.alerts.filter(alert => !alert.resolved).length;
  }, 0);
};
