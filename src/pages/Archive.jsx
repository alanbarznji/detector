import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AlertItem } from '../components/AlertItem';
import { EmptyState } from '../components/ui/EmptyState';
import { useAlertFilter } from '../hooks/useAlertFilter';
import { exportToCSV, getAlertTypeLabel } from '../utils/helpers';
import { Download, Filter, X, Archive as ArchiveIcon, Search } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { resolveAlert } from '../store/slices/alertSlice';

export const Archive = () => {
  const dispatch = useAppDispatch();
  const alerts = useAppSelector((state) => state.alerts.items);
  const cameras = useAppSelector((state) => state.cameras.items);
  const sensors = useAppSelector((state) => state.sensors.items);

  const { filteredAlerts, filters, updateFilter, clearFilters } = useAlertFilter(alerts);
  const [searchTerm, setSearchTerm] = useState('');

  const user = { name: 'أحمد محمد', role: 'admin' };

  const handleResolveAlert = (alertId) => {
    if (user) {
      dispatch(resolveAlert({ id: alertId, resolvedBy: user.name }));
    }
  };

  const handleExport = () => {
    exportToCSV(filteredAlerts, 'alerts-archive.csv');
  };

  const alertTypes = ['fire', 'smoke', 'ppe_violation', 'gas', 'temperature', 'motion'];

  const searchFilteredAlerts = filteredAlerts.filter(alert =>
    alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.sourceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            أرشيف التنبيهات
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            سجل جميع التنبيهات والأحداث
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Download className="w-5 h-5" />}
          onClick={handleExport}
          disabled={filteredAlerts.length === 0}
        >
          تصدير CSV
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="بحث في التنبيهات..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                تصفية:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.type || ''}
                onChange={(e) => updateFilter('type', e.target.value || undefined)}
              >
                <option value="">كل الأنواع</option>
                {alertTypes.map(type => (
                  <option key={type} value={type}>
                    {getAlertTypeLabel(type)}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.sourceType || ''}
                onChange={(e) => updateFilter('sourceType', e.target.value || undefined)}
              >
                <option value="">كل المصادر</option>
                <option value="camera">كاميرات</option>
                <option value="sensor">حساسات</option>
              </select>

              <select
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.severity || ''}
                onChange={(e) => updateFilter('severity', e.target.value || undefined)}
              >
                <option value="">كل الأولويات</option>
                <option value="critical">حرج</option>
                <option value="high">عالي</option>
                <option value="medium">متوسط</option>
                <option value="low">منخفض</option>
              </select>

              <select
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.resolved === undefined ? '' : filters.resolved ? 'resolved' : 'active'}
                onChange={(e) => updateFilter('resolved', e.target.value === '' ? undefined : e.target.value === 'resolved')}
              >
                <option value="">كل الحالات</option>
                <option value="active">نشط</option>
                <option value="resolved">تم الحل</option>
              </select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearFilters();
                    setSearchTerm('');
                  }}
                  icon={<X className="w-4 h-4" />}
                >
                  إلغاء التصفية
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              عرض <span className="font-semibold">{searchFilteredAlerts.length}</span> من{' '}
              <span className="font-semibold">{alerts.length}</span> تنبيه
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">
                {alerts.filter(a => a.resolved).length} تم الحل
              </Badge>
              <Badge variant="danger">
                {alerts.filter(a => !a.resolved).length} نشط
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {searchFilteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {searchFilteredAlerts.map(alert => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onResolve={handleResolveAlert}
              showImage
            />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<ArchiveIcon className="w-16 h-16" />}
            title={hasActiveFilters ? 'لا توجد نتائج' : 'لا توجد تنبيهات'}
            description={
              hasActiveFilters
                ? 'جرب تغيير معايير البحث أو التصفية'
                : 'لا توجد تنبيهات في الأرشيف حالياً'
            }
            action={
              hasActiveFilters ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    clearFilters();
                    setSearchTerm('');
                  }}
                  icon={<X className="w-5 h-5" />}
                >
                  إلغاء التصفية
                </Button>
              ) : undefined
            }
          />
        </Card>
      )}
    </div>
  );
};
