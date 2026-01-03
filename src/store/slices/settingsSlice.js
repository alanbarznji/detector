import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    theme: localStorage.getItem('theme') || 'light',
    language: 'ar',
    notifications: {
      enabled: true,
      sound: true,
      desktop: false,
    },
    autoRefresh: true,
    refreshInterval: 5000,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);

      // Update document class
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);

      // Update document class
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    updateNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
    },
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setLanguage,
  updateNotificationSettings,
  setAutoRefresh,
  setRefreshInterval,
} = settingsSlice.actions;

export default settingsSlice.reducer;
