import { useState, useEffect } from 'react';
import { Sensor } from '@/types';

export const useSensorData = (sensor: Sensor, updateInterval: number = 2000) => {
  const [currentValue, setCurrentValue] = useState(sensor.currentValue);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (sensor.status !== 'working') return;

    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        const variance = (Math.random() - 0.5) * 10;
        const newValue = Math.max(
          sensor.minValue,
          Math.min(sensor.maxValue, sensor.currentValue + variance)
        );
        setCurrentValue(Math.round(newValue * 10) / 10);
        setIsUpdating(false);
      }, 300);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [sensor, updateInterval]);

  const isInRange = currentValue >= sensor.threshold.min && currentValue <= sensor.threshold.max;

  return { currentValue, isUpdating, isInRange };
};
