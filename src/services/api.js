import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Camera API
export const cameraAPI = {
  getAll: () => apiClient.get('/cameras'),
  getById: (id) => apiClient.get(`/cameras/${id}`),
  create: (data) => apiClient.post('/cameras', data),
  update: (id, data) => apiClient.put(`/cameras/${id}`, data),
  delete: (id) => apiClient.delete(`/cameras/${id}`),
  startStream: (id) => apiClient.post(`/cameras/${id}/stream/start`),
  stopStream: (id) => apiClient.post(`/cameras/${id}/stream/stop`),
  captureSnapshot: (id) => apiClient.post(`/cameras/${id}/snapshot`),
};

// Alert API
export const alertAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        params.append(key, filters[key]);
      }
    });
    return apiClient.get(`/alerts?${params.toString()}`);
  },
  getById: (id) => apiClient.get(`/alerts/${id}`),
  create: (data) => apiClient.post('/alerts', data),
  resolve: (id, resolvedBy) => apiClient.put(`/alerts/${id}/resolve`, { resolvedBy }),
  delete: (id) => apiClient.delete(`/alerts/${id}`),
  getStats: () => apiClient.get('/alerts/stats/summary'),
};

// Sensor API
export const sensorAPI = {
  getAll: () => apiClient.get('/sensors'),
  getById: (id) => apiClient.get(`/sensors/${id}`),
  create: (data) => apiClient.post('/sensors', data),
  update: (id, data) => apiClient.put(`/sensors/${id}`, data),
  delete: (id) => apiClient.delete(`/sensors/${id}`),
  updateReading: (id, value) => apiClient.post(`/sensors/${id}/reading`, { value }),
};

// Stream API
export const streamAPI = {
  getStreamUrl: (cameraId) => `${API_BASE_URL}/api/stream/${cameraId}`,
};

export default apiClient;
