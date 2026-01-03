import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sensorAPI } from '../../services/api';
import { mockSensors } from '../../utils/mockData';

// Async thunks
export const fetchSensors = createAsyncThunk(
  'sensors/fetchSensors',
  async () => {
    const response = await sensorAPI.getAll();
    return response.data;
  }
);

export const addSensor = createAsyncThunk(
  'sensors/addSensor',
  async (sensorData) => {
    const response = await sensorAPI.create(sensorData);
    return response.data;
  }
);

export const updateSensor = createAsyncThunk(
  'sensors/updateSensor',
  async ({ id, data }) => {
    const response = await sensorAPI.update(id, data);
    return response.data;
  }
);

export const deleteSensor = createAsyncThunk(
  'sensors/deleteSensor',
  async (id) => {
    await sensorAPI.delete(id);
    return id;
  }
);

export const updateSensorReading = createAsyncThunk(
  'sensors/updateReading',
  async ({ id, value }) => {
    const response = await sensorAPI.updateReading(id, value);
    return response.data;
  }
);

const sensorSlice = createSlice({
  name: 'sensors',
  initialState: {
    items: mockSensors,
    loading: false,
    error: null,
  },
  reducers: {
    updateSensorData: (state, action) => {
      // Update sensor from Socket.IO
      const { sensorId, value, timestamp } = action.payload;
      const sensor = state.items.find(s => s.id === sensorId);
      if (sensor) {
        sensor.currentValue = value;
        sensor.lastUpdate = timestamp;

        // Check if value exceeds threshold
        if (sensor.threshold) {
          if (value < sensor.threshold.min || value > sensor.threshold.max) {
            sensor.status = 'warning';
          } else {
            sensor.status = 'working';
          }
        }
      }
    },
    updateSensorStatus: (state, action) => {
      const { sensorId, status } = action.payload;
      const sensor = state.items.find(s => s.id === sensorId);
      if (sensor) {
        sensor.status = status;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sensors
      .addCase(fetchSensors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSensors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSensors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add sensor
      .addCase(addSensor.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update sensor
      .addCase(updateSensor.fulfilled, (state, action) => {
        const index = state.items.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete sensor
      .addCase(deleteSensor.fulfilled, (state, action) => {
        state.items = state.items.filter(s => s.id !== action.payload);
      })
      // Update reading
      .addCase(updateSensorReading.fulfilled, (state, action) => {
        const index = state.items.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { updateSensorData, updateSensorStatus, clearError } = sensorSlice.actions;
export default sensorSlice.reducer;
