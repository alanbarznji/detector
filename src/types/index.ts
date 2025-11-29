export type CameraStatus = 'online' | 'offline' | 'loading';

export type AlertType = 'fire' | 'smoke' | 'ppe_violation' | 'gas' | 'temperature' | 'motion';

export type SensorStatus = 'working' | 'error' | 'disconnected';

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: CameraStatus;
  streamUrl: string;
  lastFrame?: string;
  alerts: Alert[];
  createdAt: Date;
}

export interface Sensor {
  id: string;
  name: string;
  type: 'gas' | 'temperature' | 'motion' | 'humidity' | 'pressure';
  status: SensorStatus;
  currentValue: number;
  unit: string;
  minValue: number;
  maxValue: number;
  threshold: {
    min: number;
    max: number;
  };
  alerts: Alert[];
  createdAt: Date;
}

export interface Alert {
  id: string;
  type: AlertType;
  sourceType: 'camera' | 'sensor';
  sourceId: string;
  sourceName: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  avatar?: string;
}

export interface TimelineEvent {
  id: string;
  type: 'alert' | 'camera_offline' | 'sensor_error' | 'system';
  timestamp: Date;
  description: string;
  icon: string;
  severity: 'info' | 'warning' | 'error';
}

export interface AnalyticsData {
  alertsPerDay: { date: string; count: number }[];
  alertsByType: { type: string; count: number }[];
  cameraStatus: { online: number; offline: number };
  sensorActivity: { name: string; alertCount: number }[];
}

export type GridLayout = '1x1' | '2x2' | '3x3' | '4x4';

export interface AppSettings {
  theme: 'light' | 'dark';
  cameraSettings: {
    reconnectInterval: number;
    streamQuality: 'low' | 'medium' | 'high';
  };
  sensorSettings: {
    updateInterval: number;
    autoAlert: boolean;
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
    email: boolean;
  };
}
