import { streamProcessor } from './streamProcessor.js';
import dotenv from 'dotenv';

dotenv.config();

let io;

/**
 * Setup Socket.IO event handlers
 * @param {Object} socketIO - Socket.IO server instance
 */
export function setupSocketIO(socketIO) {
  io = socketIO;

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to Detector Backend',
      socketId: socket.id,
      timestamp: new Date()
    });

    // Handle camera stream requests
    socket.on('camera:start', (data) => {
      console.log(`Starting camera stream: ${data.cameraId}`);
      socket.emit('camera:started', { cameraId: data.cameraId });
    });

    socket.on('camera:stop', (data) => {
      console.log(`Stopping camera stream: ${data.cameraId}`);
      socket.emit('camera:stopped', { cameraId: data.cameraId });
    });

    // Handle detection events
    socket.on('detection:subscribe', (data) => {
      console.log(`Client subscribed to detections: ${data.cameraId || 'all'}`);
      socket.join(`detections:${data.cameraId || 'all'}`);

      // Start HLS stream for this camera if not already running
      if (data.cameraId && data.cameraId !== 'all') {
        const rtspUrl = process.env.RTSP_URL;
        if (rtspUrl && !streamProcessor.hlsStreams.has(data.cameraId)) {
          console.log(`🎥 Starting HLS stream for camera: ${data.cameraId}`);
          streamProcessor.startHLSStream(rtspUrl, data.cameraId, io);
        }
      }
    });

    socket.on('detection:unsubscribe', (data) => {
      console.log(`Client unsubscribed from detections: ${data.cameraId || 'all'}`);
      socket.leave(`detections:${data.cameraId || 'all'}`);

      // Optional: Stop HLS stream if no more clients are subscribed
      // For now, we'll keep streams running for performance
    });

    // Handle sensor data
    socket.on('sensor:update', (data) => {
      // Broadcast sensor update to all clients
      io.emit('sensor:data', data);
    });

    // Handle alerts
    socket.on('alert:new', (alert) => {
      console.log('New alert received:', alert);
      // Broadcast to all clients
      io.emit('alert:created', alert);
    });

    socket.on('alert:resolve', (data) => {
      console.log('Alert resolved:', data.alertId);
      io.emit('alert:resolved', data);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });

    // Error handler
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
}

/**
 * Emit detection result to clients
 * @param {Object} detection - Detection result from YOLO
 */
export function emitDetection(detection) {
  if (io) {
    io.to(`detections:${detection.cameraId}`).emit('detection:result', detection);
    io.to('detections:all').emit('detection:result', detection);
  }
}

/**
 * Emit alert to clients
 * @param {Object} alert - Alert data
 */
export function emitAlert(alert) {
  if (io) {
    io.emit('alert:new', alert);
  }
}

/**
 * Emit sensor data to clients
 * @param {Object} sensorData - Sensor reading data
 */
export function emitSensorData(sensorData) {
  if (io) {
    io.emit('sensor:update', sensorData);
  }
}

/**
 * Get Socket.IO instance
 */
export function getIO() {
  return io;
}
