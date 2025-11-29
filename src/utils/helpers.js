import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export const formatDate = (date) => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ar });
};

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(date, { addSuffix: true, locale: ar });
};

export const getCameraStatusColor = (status) => {
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

export const getSensorStatusColor = (status) => {
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

export const getAlertSeverityColor = (severity) => {
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

export const getAlertTypeLabel = (type) => {
  const labels = {
    fire: 'حريق',
    smoke: 'دخان',
    ppe_violation: 'مخالفة معدات السلامة',
    gas: 'تسرب غاز',
    temperature: 'حرارة عالية',
    motion: 'حركة غير مصرح بها',
  };
  return labels[type] || type;
};

export const getPPEViolationLabel = (violationType) => {
  const labels = {
    no_helmet: 'بدون خوذة',
    no_vest: 'بدون سترة سلامة',
    no_gloves: 'بدون قفازات',
    no_boots: 'بدون أحذية سلامة',
    no_goggles: 'بدون نظارات واقية',
    no_mask: 'بدون كمامة',
  };
  return labels[violationType] || violationType;
};

export const getDetectionTypeLabel = (detectionType) => {
  const labels = {
    fire: 'كشف الحريق',
    smoke: 'كشف الدخان',
    ppe: 'كشف معدات السلامة',
    fire_and_smoke: 'كشف الحريق والدخان',
    all: 'كشف شامل',
  };
  return labels[detectionType] || detectionType;
};

export const getDetectionTypeBadgeColor = (detectionType) => {
  switch (detectionType) {
    case 'fire':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'smoke':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    case 'ppe':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'fire_and_smoke':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'all':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    default:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  }
};

export const getSensorTypeLabel = (type) => {
  const labels = {
    gas: 'غاز',
    temperature: 'حرارة',
    motion: 'حركة',
    humidity: 'رطوبة',
    pressure: 'ضغط',
  };
  return labels[type] || type;
};

export const exportToCSV = (data, filename = 'alerts.csv') => {
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

export const getGridCols = (layout) => {
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

export const isSensorValueInRange = (sensor) => {
  return sensor.currentValue >= sensor.threshold.min && sensor.currentValue <= sensor.threshold.max;
};

export const getActiveAlerts = (items) => {
  return items.reduce((count, item) => {
    return count + item.alerts.filter(alert => !alert.resolved).length;
  }, 0);
};
