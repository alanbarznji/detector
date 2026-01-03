import { configureStore } from '@reduxjs/toolkit';
import cameraReducer from './slices/cameraSlice';
import alertReducer from './slices/alertSlice';
import sensorReducer from './slices/sensorSlice';
import settingsReducer from './slices/settingsSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

export const store = configureStore({
  reducer: {
    cameras: cameraReducer,
    alerts: alertReducer,
    sensors: sensorReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for date serialization
        ignoredActions: ['alerts/addAlert', 'sensors/updateSensorReading'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'payload.lastUpdate', 'payload.createdAt'],
        // Ignore these paths in the state
        ignoredPaths: ['alerts.items', 'sensors.items'],
      },
    }).concat(socketMiddleware),
});
