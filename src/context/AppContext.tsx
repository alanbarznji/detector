import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Camera, Sensor, Alert, User, AppSettings } from '@/types';
import { mockCameras, mockSensors, mockAlerts } from '@/utils/mockData';

interface AppContextType {
  cameras: Camera[];
  sensors: Sensor[];
  alerts: Alert[];
  user: User | null;
  settings: AppSettings;
  addCamera: (camera: Camera) => void;
  updateCamera: (id: string, updates: Partial<Camera>) => void;
  deleteCamera: (id: string) => void;
  addSensor: (sensor: Sensor) => void;
  updateSensor: (id: string, updates: Partial<Sensor>) => void;
  deleteSensor: (id: string) => void;
  resolveAlert: (id: string, resolvedBy: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  theme: 'light',
  cameraSettings: {
    reconnectInterval: 5000,
    streamQuality: 'medium',
  },
  sensorSettings: {
    updateInterval: 2000,
    autoAlert: true,
  },
  notifications: {
    enabled: true,
    sound: true,
    email: false,
  },
};

const defaultUser: User = {
  id: '1',
  name: 'أحمد محمد',
  email: 'admin@example.com',
  role: 'admin',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [user] = useState<User | null>(defaultUser);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setSettings(prev => ({ ...prev, theme: savedTheme }));
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const addCamera = (camera: Camera) => {
    setCameras(prev => [...prev, camera]);
  };

  const updateCamera = (id: string, updates: Partial<Camera>) => {
    setCameras(prev => prev.map(cam => cam.id === id ? { ...cam, ...updates } : cam));
  };

  const deleteCamera = (id: string) => {
    setCameras(prev => prev.filter(cam => cam.id !== id));
  };

  const addSensor = (sensor: Sensor) => {
    setSensors(prev => [...prev, sensor]);
  };

  const updateSensor = (id: string, updates: Partial<Sensor>) => {
    setSensors(prev => prev.map(sen => sen.id === id ? { ...sen, ...updates } : sen));
  };

  const deleteSensor = (id: string) => {
    setSensors(prev => prev.filter(sen => sen.id !== id));
  };

  const resolveAlert = (id: string, resolvedBy: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id
        ? { ...alert, resolved: true, resolvedBy, resolvedAt: new Date() }
        : alert
    ));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.theme) {
        localStorage.setItem('theme', newSettings.theme);
        if (newSettings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return updated;
    });
  };

  const value: AppContextType = {
    cameras,
    sensors,
    alerts,
    user,
    settings,
    addCamera,
    updateCamera,
    deleteCamera,
    addSensor,
    updateSensor,
    deleteSensor,
    resolveAlert,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
