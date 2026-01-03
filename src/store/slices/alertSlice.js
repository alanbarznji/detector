import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { alertAPI } from '../../services/api';

// Async thunks
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (filters = {}) => {
    const response = await alertAPI.getAll(filters);
    return response.data;
  }
);

export const createAlert = createAsyncThunk(
  'alerts/createAlert',
  async (alertData) => {
    const response = await alertAPI.create(alertData);
    return response.data;
  }
);

export const resolveAlert = createAsyncThunk(
  'alerts/resolveAlert',
  async ({ id, resolvedBy }) => {
    const response = await alertAPI.resolve(id, resolvedBy);
    return response.data;
  }
);

export const deleteAlert = createAsyncThunk(
  'alerts/deleteAlert',
  async (id) => {
    await alertAPI.delete(id);
    return id;
  }
);

export const fetchAlertStats = createAsyncThunk(
  'alerts/fetchStats',
  async () => {
    const response = await alertAPI.getStats();
    return response.data;
  }
);

const alertSlice = createSlice({
  name: 'alerts',
  initialState: {
    items: [],
    stats: {
      total: 0,
      active: 0,
      resolved: 0,
      byType: {},
      bySeverity: {},
      bySource: {},
    },
    filters: {
      resolved: null,
      type: null,
      sourceType: null,
      severity: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    addAlert: (state, action) => {
      // Add alert from Socket.IO
      state.items.unshift(action.payload);
      state.stats.total += 1;
      state.stats.active += 1;
    },
    updateAlert: (state, action) => {
      const index = state.items.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        resolved: null,
        type: null,
        sourceType: null,
        severity: null,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create alert
      .addCase(createAlert.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Resolve alert
      .addCase(resolveAlert.fulfilled, (state, action) => {
        const index = state.items.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
          state.stats.active -= 1;
          state.stats.resolved += 1;
        }
      })
      // Delete alert
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.items = state.items.filter(a => a.id !== action.payload);
        state.stats.total -= 1;
      })
      // Fetch stats
      .addCase(fetchAlertStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { addAlert, updateAlert, setFilters, clearFilters, clearError } = alertSlice.actions;
export default alertSlice.reducer;
