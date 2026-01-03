import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CameraCard } from '../components/CameraCard';
import { EmptyState } from '../components/ui/EmptyState';
import { getGridCols } from '../utils/helpers';
import { Plus, Grid3x3, LayoutGrid, Maximize2, Video } from 'lucide-react';
import { useAppSelector } from '../hooks/useRedux';

export const Cameras = () => {
  const cameras = useAppSelector((state) => state.cameras.items);
  const [layout, setLayout] = useState('2x2');

  const onlineCameras = cameras.filter(c => c.status === 'online').length;
  const offlineCameras = cameras.filter(c => c.status === 'offline').length;

  const gridLayouts = [
    { value: '1x1', icon: Maximize2, label: '1×1' },
    { value: '2x2', icon: LayoutGrid, label: '2×2' },
    { value: '3x3', icon: Grid3x3, label: '3×3' },
    { value: '4x4', icon: Grid3x3, label: '4×4' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            الكاميرات
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            عرض مباشر لجميع الكاميرات
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
        >
          إضافة كاميرا
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Card padding="sm" className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                متصل: <span className="font-semibold">{onlineCameras}</span>
              </span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-danger-500 rounded-full" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                غير متصل: <span className="font-semibold">{offlineCameras}</span>
              </span>
            </div>
          </Card>
        </div>

        <Card padding="sm">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              العرض:
            </span>
            {gridLayouts.map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={layout === value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setLayout(value)}
                icon={<Icon className="w-4 h-4" />}
              >
                {label}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {cameras.length > 0 ? (
        <div className={`grid ${getGridCols(layout)} gap-6`}>
          {cameras.map(camera => (
            <CameraCard
              key={camera.id}
              camera={camera}
              showControls
            />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<Video className="w-16 h-16" />}
            title="لا توجد كاميرات"
            description="ابدأ بإضافة كاميرا جديدة للمراقبة"
            action={
              <Button
                variant="primary"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة كاميرا
              </Button>
            }
          />
        </Card>
      )}
    </div>
  );
};
