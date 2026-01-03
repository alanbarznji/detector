import express from 'express';
import { streamProcessor } from '../services/streamProcessor.js';

const router = express.Router();

// Get stream status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      activeStreams: streamProcessor.getActiveStreamsCount(),
      timestamp: new Date()
    }
  });
});

// Test RTSP connection
router.post('/test', async (req, res) => {
  const { rtspUrl } = req.body;

  if (!rtspUrl) {
    return res.status(400).json({
      success: false,
      error: 'RTSP URL is required'
    });
  }

  try {
    const testId = 'test-' + Date.now();
    const snapshotPath = await streamProcessor.captureSnapshot(rtspUrl, testId);

    res.json({
      success: true,
      message: 'RTSP connection successful',
      data: {
        snapshotUrl: snapshotPath
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to connect to RTSP stream',
      details: error.message
    });
  }
});

export default router;
