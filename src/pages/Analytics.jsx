import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockAnalytics } from '../utils/mockData';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Activity, AlertTriangle, Camera } from 'lucide-react';
import { useAppSelector } from '../hooks/useRedux';

export const Analytics = () => {
  const cameras = useAppSelector((state) => state.cameras.items);
  const sensors = useAppSelector((state) => state.sensors.items);
  const alerts = useAppSelector((state) => state.alerts.items);

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

  const onlineCameras = cameras.filter(c => c.status === 'online').length;
  const offlineCameras = cameras.filter(c => c.status === 'offline').length;

  const cameraStatusData = [
    { name: 'متصل', value: onlineCameras },
    { name: 'غير متصل', value: offlineCameras },
  ];

  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const resolvedAlerts = alerts.filter(a => a.resolved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          التحليلات
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          إحصائيات ورؤى حول نشاط النظام
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                إجمالي التنبيهات
              </p>
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                {alerts.length}
              </p>
            </div>
            <div className="p-3 bg-primary-600 dark:bg-primary-700 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-gray-600 dark:text-gray-300">
              آخر 7 أيام
            </span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-success-200 dark:border-success-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-success-600 dark:text-success-400 mb-1">
                تم حلها
              </p>
              <p className="text-3xl font-bold text-success-700 dark:text-success-300">
                {resolvedAlerts}
              </p>
            </div>
            <div className="p-3 bg-success-600 dark:bg-success-700 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            {alerts.length > 0
              ? `${Math.round((resolvedAlerts / alerts.length) * 100)}% نسبة الحل`
              : '0% نسبة الحل'}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-danger-50 to-danger-100 dark:from-danger-900/20 dark:to-danger-800/20 border-danger-200 dark:border-danger-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-danger-600 dark:text-danger-400 mb-1">
                تنبيهات نشطة
              </p>
              <p className="text-3xl font-bold text-danger-700 dark:text-danger-300">
                {activeAlerts}
              </p>
            </div>
            <div className="p-3 bg-danger-600 dark:bg-danger-700 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            تحتاج إلى معالجة
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                معدل التنبيه اليومي
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {Math.round(alerts.length / 7)}
              </p>
            </div>
            <div className="p-3 bg-blue-600 dark:bg-blue-700 rounded-lg">
              <BarChart className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            متوسط آخر 7 أيام
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              التنبيهات خلال الأسبوع
            </h2>
            <Badge variant="default">آخر 7 أيام</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAnalytics.alertsPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="عدد التنبيهات"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              التنبيهات حسب النوع
            </h2>
            <Badge variant="default">الإجمالي</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockAnalytics.alertsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="type"
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="عدد التنبيهات">
                {mockAnalytics.alertsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              حالة الكاميرات
            </h2>
            <Badge variant="default">{cameras.length} كاميرا</Badge>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cameraStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              نشاط الحساسات
            </h2>
            <Badge variant="default">حسب التنبيهات</Badge>
          </div>
          <div className="space-y-4">
            {mockAnalytics.sensorActivity.map((sensor, index) => {
              const maxCount = Math.max(...mockAnalytics.sensorActivity.map(s => s.alertCount));
              const percentage = (sensor.alertCount / maxCount) * 100;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {sensor.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {sensor.alertCount} تنبيه
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
