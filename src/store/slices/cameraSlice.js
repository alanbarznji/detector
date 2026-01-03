import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cameraAPI } from '../../services/api';

// Async thunks
export const fetchCameras = createAsyncThunk(
  'cameras/fetchCameras',
  async () => {
    const response = await cameraAPI.getAll();
    return response.data;
  }
);

export const addCamera = createAsyncThunk(
  'cameras/addCamera',
  async (cameraData) => {
    const response = await cameraAPI.create(cameraData);
    return response.data;
  }
);

export const updateCamera = createAsyncThunk(
  'cameras/updateCamera',
  async ({ id, data }) => {
    const response = await cameraAPI.update(id, data);
    return response.data;
  }
);

export const deleteCamera = createAsyncThunk(
  'cameras/deleteCamera',
  async (id) => {
    await cameraAPI.delete(id);
    return id;
  }
);

export const startCameraStream = createAsyncThunk(
  'cameras/startStream',
  async (id) => {
    const response = await cameraAPI.startStream(id);
    return response.data;
  }
);

export const stopCameraStream = createAsyncThunk(
  'cameras/stopStream',
  async (id) => {
    const response = await cameraAPI.stopStream(id);
    return response.data;
  }
);

export const captureSnapshot = createAsyncThunk(
  'cameras/captureSnapshot',
  async (id) => {
    const response = await cameraAPI.captureSnapshot(id);
    return { id, snapshot: response.data };
  }
);

const cameraSlice = createSlice({
  name: 'cameras',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentFrame: {},
  },
  reducers: {
    updateCameraStatus: (state, action) => {
      const { cameraId, status } = action.payload;
      const camera = state.items.find(c => c.id === cameraId);
      if (camera) {
        camera.status = status;
      }
    },
    updateCameraFrame: (state, action) => {
      const { cameraId, frame } = action.payload;
      state.currentFrame[cameraId] = frame;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cameras
      .addCase(fetchCameras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCameras.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCameras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add camera
      .addCase(addCamera.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update camera
      .addCase(updateCamera.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete camera
      .addCase(deleteCamera.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      })
      // Start stream
      .addCase(startCameraStream.fulfilled, (state, action) => {
        const camera = state.items.find(c => c.id === action.payload.id);
        if (camera) {
          camera.status = 'online';
        }
      })
      // Stop stream
      .addCase(stopCameraStream.fulfilled, (state, action) => {
        const camera = state.items.find(c => c.id === action.payload.id);
        if (camera) {
          camera.status = 'offline';
        }
      })
      // Capture snapshot
      .addCase(captureSnapshot.fulfilled, (state, action) => {
        const { id, snapshot } = action.payload;
        const camera = state.items.find(c => c.id === id);
        if (camera) {
          camera.lastSnapshot = snapshot;
        }
      });
  },
});

export const { updateCameraStatus, updateCameraFrame, clearError } = cameraSlice.actions;
export default cameraSlice.reducer;
