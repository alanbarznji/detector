import { io } from 'socket.io-client';
import { addAlert, updateAlert } from '../slices/alertSlice';
import { updateCameraStatus, updateCameraFrame } from '../slices/cameraSlice';
import { updateSensorData } from '../slices/sensorSlice';

let socket = null;

export const socketMiddleware = (store) => {
  return (next) => (action) => {
    // Initialize socket connection on app start
    if (action.type === 'socket/connect') {
      if (socket) {
        socket.disconnect();
      }

      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      socket = io(BACKEND_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      // Connection events
      socket.on('connect', () => {
        console.log('✅ Connected to backend:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from backend');
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      // Alert events
      socket.on('alert:new', (alert) => {
        store.dispatch(addAlert(alert));

        // Show browser notification if enabled
        const settings = store.getState().settings;
        if (settings.notifications.enabled && settings.notifications.desktop) {
          showNotification(alert);
        }
      });

      socket.on('alert:resolved', (data) => {
        store.dispatch(updateAlert(data));
      });

      // Camera events
      socket.on('camera:frame', (data) => {
        store.dispatch(updateCameraFrame(data));
      });

      socket.on('camera:status', (data) => {
        store.dispatch(updateCameraStatus(data));
      });

      // Detection events
      socket.on('detection:result', (detection) => {
        console.log('Detection received:', detection);
        // You can dispatch additional actions here based on detection results
      });

      // Sensor events
      socket.on('sensor:update', (data) => {
        store.dispatch(updateSensorData(data));
      });

      return next(action);
    }

    // Disconnect socket
    if (action.type === 'socket/disconnect') {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return next(action);
    }

    // Subscribe to camera detections
    if (action.type === 'socket/subscribeDetections') {
      if (socket) {
        socket.emit('detection:subscribe', { cameraId: action.payload });
      }
      return next(action);
    }

    // Unsubscribe from camera detections
    if (action.type === 'socket/unsubscribeDetections') {
      if (socket) {
        socket.emit('detection:unsubscribe', { cameraId: action.payload });
      }
      return next(action);
    }

    return next(action);
  };
};

// Helper function to show browser notifications
function showNotification(alert) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('تنبيه جديد', {
      body: alert.description,
      icon: '/logo.png',
      tag: alert.id,
      requireInteraction: alert.severity === 'critical',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

// Export socket instance getter
export const getSocket = () => socket;
