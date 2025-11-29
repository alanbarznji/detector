import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCameras, mockSensors, mockAlerts } from '../utils/mockData';

const AppContext = createContext(undefined);

const defaultSettings = {
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

const defaultUser = {
  id: '1',
  name: 'أحمد محمد',
  email: 'admin@example.com',
  role: 'admin',
};

export const AppProvider = ({ children }) => {
  const [cameras, setCameras] = useState(mockCameras);
  const [sensors, setSensors] = useState(mockSensors);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [user] = useState(defaultUser);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setSettings(prev => ({ ...prev, theme: savedTheme }));
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const addCamera = (camera) => {
    setCameras(prev => [...prev, camera]);
  };

  const updateCamera = (id, updates) => {
    setCameras(prev => prev.map(cam => cam.id === id ? { ...cam, ...updates } : cam));
  };

  const deleteCamera = (id) => {
    setCameras(prev => prev.filter(cam => cam.id !== id));
  };

  const addSensor = (sensor) => {
    setSensors(prev => [...prev, sensor]);
  };

  const updateSensor = (id, updates) => {
    setSensors(prev => prev.map(sen => sen.id === id ? { ...sen, ...updates } : sen));
  };

  const deleteSensor = (id) => {
    setSensors(prev => prev.filter(sen => sen.id !== id));
  };

  const resolveAlert = (id, resolvedBy) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id
        ? { ...alert, resolved: true, resolvedBy, resolvedAt: new Date() }
        : alert
    ));
  };

  const updateSettings = (newSettings) => {
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

  const value = {
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
