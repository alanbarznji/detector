import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Cameras } from './pages/Cameras';
import { CameraView } from './pages/CameraView';
import { Sensors } from './pages/Sensors';
import { Archive } from './pages/Archive';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { useAppDispatch } from './hooks/useRedux';
import { fetchCameras } from './store/slices/cameraSlice';
import { fetchSensors } from './store/slices/sensorSlice';
import { fetchAlerts } from './store/slices/alertSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load initial data from backend
    dispatch(fetchCameras());
    dispatch(fetchSensors());
    dispatch(fetchAlerts());
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/cameras/:id" element={<CameraView />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
