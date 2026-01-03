import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CameraCard } from '../components/CameraCard';
import { AlertItem } from '../components/AlertItem';
import { mockTimelineEvents } from '../utils/mockData';
import { formatRelativeTime, getAlertTypeLabel } from '../utils/helpers';
import { Camera, Activity, AlertTriangle, Clock, TrendingUp, Video, VideoOff } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { resolveAlert } from '../store/slices/alertSlice';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const cameras = useAppSelector((state) => state.cameras.items);
  const sensors = useAppSelector((state) => state.sensors.items);
  const alerts = useAppSelector((state) => state.alerts.items);

  const user = { name: 'أحمد محمد', role: 'admin' };

  const onlineCameras = cameras.filter(c => c.status === 'online').length;
  const offlineCameras = cameras.filter(c => c.status === 'offline').length;
  const workingSensors = sensors.filter(s => s.status === 'working').length;
  const activeAlerts = alerts.filter(a => !a.resolved);
  const recentAlerts = alerts.slice(0, 5);

  const displayCameras = cameras.slice(0, 4);

  const handleResolveAlert = (alertId) => {
    if (user) {
      dispatch(resolveAlert({ id: alertId, resolvedBy: user.name }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          لوحة التحكم
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          نظرة عامة على حالة النظام والتنبيهات
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                الكاميرات المتصلة
              </p>
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                {onlineCameras}/{cameras.length}
              </p>
            </div>
            <div className="p-3 bg-primary-600 dark:bg-primary-700 rounded-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-gray-600 dark:text-gray-300">
              {offlineCameras} غير متصل
            </span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-success-200 dark:border-success-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-success-600 dark:text-success-400 mb-1">
                الحساسات النشطة
              </p>
              <p className="text-3xl font-bold text-success-700 dark:text-success-300">
                {workingSensors}/{sensors.length}
              </p>
            </div>
            <div className="p-3 bg-success-600 dark:bg-success-700 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-gray-600 dark:text-gray-300">
              {sensors.length - workingSensors} غير نشط
            </span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-danger-50 to-danger-100 dark:from-danger-900/20 dark:to-danger-800/20 border-danger-200 dark:border-danger-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-danger-600 dark:text-danger-400 mb-1">
                التنبيهات النشطة
              </p>
              <p className="text-3xl font-bold text-danger-700 dark:text-danger-300">
                {activeAlerts.length}
              </p>
            </div>
            <div className="p-3 bg-danger-600 dark:bg-danger-700 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              {alerts.length - activeAlerts.length} تم حلها
            </span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 border-warning-200 dark:border-warning-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-warning-600 dark:text-warning-400 mb-1">
                إجمالي الأحداث
              </p>
              <p className="text-3xl font-bold text-warning-700 dark:text-warning-300">
                {alerts.length}
              </p>
            </div>
            <div className="p-3 bg-warning-600 dark:bg-warning-700 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              آخر 24 ساعة
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                الكاميرات
              </h2>
              <Badge variant="default">{cameras.length} كاميرا</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayCameras.map(camera => (
                <CameraCard key={camera.id} camera={camera} />
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                التنبيهات النشطة
              </h2>
              <Badge variant="danger">{activeAlerts.length}</Badge>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {activeAlerts.length > 0 ? (
                activeAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {getAlertTypeLabel(alert.type)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {alert.sourceName}
                        </p>
                      </div>
                      <Badge
                        variant={
                          alert.severity === 'critical' ? 'danger' :
                          alert.severity === 'high' ? 'warning' : 'info'
                        }
                        size="sm"
                      >
                        {alert.severity === 'critical' ? 'حرج' :
                         alert.severity === 'high' ? 'عالي' : 'متوسط'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(alert.timestamp)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>لا توجد تنبيهات نشطة</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            الأحداث الأخيرة
          </h2>
          <Badge variant="default">{mockTimelineEvents.length} حدث</Badge>
        </div>
        <div className="space-y-4">
          {mockTimelineEvents.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  event.severity === 'error' ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-600' :
                  event.severity === 'warning' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-600' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                }`}>
                  <Clock className="w-5 h-5" />
                </div>
                {index < mockTimelineEvents.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 min-h-[40px]" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {event.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatRelativeTime(event.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
