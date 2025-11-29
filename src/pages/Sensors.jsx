import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SensorCard } from '../components/SensorCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Plus, Activity, AlertCircle, CheckCircle } from 'lucide-react';

export const Sensors = () => {
  const { sensors } = useApp();

  const workingSensors = sensors.filter(s => s.status === 'working').length;
  const errorSensors = sensors.filter(s => s.status === 'error').length;
  const disconnectedSensors = sensors.filter(s => s.status === 'disconnected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            الحساسات
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            مراقبة الحساسات والقراءات المباشرة
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
        >
          إضافة حساس
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-success-200 dark:border-success-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-success-600 dark:text-success-400 mb-1">
                حساسات تعمل
              </p>
              <p className="text-3xl font-bold text-success-700 dark:text-success-300">
                {workingSensors}
              </p>
            </div>
            <div className="p-3 bg-success-600 dark:bg-success-700 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-danger-50 to-danger-100 dark:from-danger-900/20 dark:to-danger-800/20 border-danger-200 dark:border-danger-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-danger-600 dark:text-danger-400 mb-1">
                حساسات بها أخطاء
              </p>
              <p className="text-3xl font-bold text-danger-700 dark:text-danger-300">
                {errorSensors}
              </p>
            </div>
            <div className="p-3 bg-danger-600 dark:bg-danger-700 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                حساسات غير متصلة
              </p>
              <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                {disconnectedSensors}
              </p>
            </div>
            <div className="p-3 bg-gray-600 dark:bg-gray-700 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {sensors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map(sensor => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<Activity className="w-16 h-16" />}
            title="لا توجد حساسات"
            description="ابدأ بإضافة حساس جديد للمراقبة"
            action={
              <Button
                variant="primary"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة حساس
              </Button>
            }
          />
        </Card>
      )}
    </div>
  );
};
