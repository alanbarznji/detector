import express from 'express';
import { streamProcessor } from '../services/streamProcessor.js';

const router = express.Router();

// Mock database (replace with actual database)
let cameras = [
  {
    id: '1',
    name: 'كاميرا المدخل الرئيسي',
    location: 'المدخل الرئيسي',
    rtspUrl: process.env.RTSP_URL || 'rtsp://mcbt:alan22@192.168.100.201:554/Streaming/Channels/101',
    status: 'online',
    detectionCapabilities: ['fire', 'smoke', 'ppe'],
    isDetectionActive: true,
    createdAt: new Date()
  }
];

// Get all cameras
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: cameras
  });
});

// Get camera by ID
router.get('/:id', (req, res) => {
  const camera = cameras.find(c => c.id === req.params.id);

  if (!camera) {
    return res.status(404).json({
      success: false,
      error: 'Camera not found'
    });
  }

  res.json({
    success: true,
    data: camera
  });
});

// Add new camera
router.post('/', (req, res) => {
  const { name, location, rtspUrl, detectionCapabilities } = req.body;

  if (!name || !rtspUrl) {
    return res.status(400).json({
      success: false,
      error: 'Name and RTSP URL are required'
    });
  }

  const newCamera = {
    id: String(cameras.length + 1),
    name,
    location: location || '',
    rtspUrl,
    status: 'offline',
    detectionCapabilities: detectionCapabilities || ['fire', 'smoke'],
    isDetectionActive: true,
    createdAt: new Date()
  };

  cameras.push(newCamera);

  res.status(201).json({
    success: true,
    data: newCamera
  });
});

// Update camera
router.put('/:id', (req, res) => {
  const index = cameras.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Camera not found'
    });
  }

  cameras[index] = {
    ...cameras[index],
    ...req.body,
    id: req.params.id // Ensure ID doesn't change
  };

  res.json({
    success: true,
    data: cameras[index]
  });
});

// Delete camera
router.delete('/:id', (req, res) => {
  const index = cameras.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Camera not found'
    });
  }

  // Stop stream if active
  streamProcessor.stopStream(req.params.id);

  cameras.splice(index, 1);

  res.json({
    success: true,
    message: 'Camera deleted successfully'
  });
});

// Start camera stream
router.post('/:id/stream/start', (req, res) => {
  const camera = cameras.find(c => c.id === req.params.id);

  if (!camera) {
    return res.status(404).json({
      success: false,
      error: 'Camera not found'
    });
  }

  try {
    const { io } = await import('../server.js');
    streamProcessor.startStream(camera.rtspUrl, camera.id, io);

    // Update camera status
    camera.status = 'online';

    res.json({
      success: true,
      message: 'Stream started',
      data: camera
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Stop camera stream
router.post('/:id/stream/stop', (req, res) => {
  const camera = cameras.find(c => c.id === req.params.id);

  if (!camera) {
    return res.status(404).json({
      success: false,
      error: 'Camera not found'
    });
  }

  streamProcessor.stopStream(camera.id);
  camera.status = 'offline';

  res.json({
    success: true,
    message: 'Stream stopped',
    data: camera
  });
});

// Capture snapshot
router.post('/:id/snapshot', async (req, res) => {
  const camera = cameras.find(c => c.id === req.params.id);

  if (!camera) {
    return res.status(404).json({
      success: false,
      error: 'Camera not found'
    });
  }

  try {
    const snapshotPath = await streamProcessor.captureSnapshot(camera.rtspUrl, camera.id);

    res.json({
      success: true,
      data: {
        snapshotUrl: snapshotPath,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
