import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Set FFmpeg path
const ffmpegPath = process.env.FFMPEG_PATH || 'C:\\\\ffmpeg\\\\bin\\\\ffmpeg.exe';
ffmpeg.setFfmpegPath(ffmpegPath);

class StreamProcessor {
  constructor() {
    this.activeStreams = new Map();
    this.snapshotsDir = path.join(process.cwd(), 'uploads', 'snapshots');
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.snapshotsDir)) {
      fs.mkdirSync(this.snapshotsDir, { recursive: true });
    }
  }

  /**
   * Start processing RTSP stream
   * @param {string} streamUrl - RTSP URL
   * @param {string} cameraId - Camera ID
   * @param {Object} io - Socket.IO instance
   */
  startStream(streamUrl, cameraId, io) {
    if (this.activeStreams.has(cameraId)) {
      console.log(`Stream already active for camera ${cameraId}`);
      return;
    }

    console.log(`Starting stream for camera ${cameraId}`);
    console.log(`RTSP URL: ${streamUrl}`);

    const stream = ffmpeg(streamUrl)
      .inputOptions([
        '-rtsp_transport', 'tcp',
        '-analyzeduration', '1000000',
        '-probesize', '1000000'
      ])
      .outputOptions([
        '-f', 'image2',
        '-vf', 'fps=1',
        '-update', '1'
      ])
      .on('start', (commandLine) => {
        console.log(`FFmpeg started: ${commandLine}`);
        io.emit('stream:status', {
          cameraId,
          status: 'connected',
          timestamp: new Date()
        });
      })
      .on('error', (err, stdout, stderr) => {
        console.error(`Stream error for camera ${cameraId}:`, err.message);
        console.error('FFmpeg stderr:', stderr);

        this.activeStreams.delete(cameraId);

        io.emit('stream:status', {
          cameraId,
          status: 'error',
          error: err.message,
          timestamp: new Date()
        });

        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          this.startStream(streamUrl, cameraId, io);
        }, 5000);
      })
      .on('end', () => {
        console.log(`Stream ended for camera ${cameraId}`);
        this.activeStreams.delete(cameraId);

        io.emit('stream:status', {
          cameraId,
          status: 'disconnected',
          timestamp: new Date()
        });
      });

    // Save snapshot
    const snapshotPath = path.join(this.snapshotsDir, `camera_${cameraId}.jpg`);
    stream.save(snapshotPath);

    this.activeStreams.set(cameraId, stream);

    // Emit frame updates periodically
    const frameInterval = setInterval(() => {
      if (fs.existsSync(snapshotPath)) {
        const imageData = fs.readFileSync(snapshotPath, 'base64');
        io.emit('stream:frame', {
          cameraId,
          image: `data:image/jpeg;base64,${imageData}`,
          timestamp: new Date()
        });
      }
    }, 1000);

    this.activeStreams.get(cameraId).frameInterval = frameInterval;
  }

  /**
   * Stop stream for a camera
   * @param {string} cameraId - Camera ID
   */
  stopStream(cameraId) {
    const stream = this.activeStreams.get(cameraId);
    if (stream) {
      if (stream.frameInterval) {
        clearInterval(stream.frameInterval);
      }
      stream.kill('SIGKILL');
      this.activeStreams.delete(cameraId);
      console.log(`Stream stopped for camera ${cameraId}`);
    }
  }

  /**
   * Capture snapshot from stream
   * @param {string} streamUrl - RTSP URL
   * @param {string} cameraId - Camera ID
   * @returns {Promise<string>} - Path to saved snapshot
   */
  captureSnapshot(streamUrl, cameraId) {
    return new Promise((resolve, reject) => {
      const filename = `snapshot_${cameraId}_${uuidv4()}.jpg`;
      const outputPath = path.join(this.snapshotsDir, filename);

      ffmpeg(streamUrl)
        .inputOptions([
          '-rtsp_transport', 'tcp',
          '-analyzeduration', '1000000',
          '-probesize', '1000000'
        ])
        .outputOptions([
          '-vframes', '1',
          '-q:v', '2'
        ])
        .on('end', () => {
          console.log(`Snapshot captured: ${outputPath}`);
          resolve(`/uploads/snapshots/${filename}`);
        })
        .on('error', (err) => {
          console.error('Snapshot error:', err);
          reject(err);
        })
        .save(outputPath);
    });
  }

  /**
   * Get active streams count
   */
  getActiveStreamsCount() {
    return this.activeStreams.size;
  }

  /**
   * Stop all streams
   */
  stopAllStreams() {
    for (const [cameraId] of this.activeStreams) {
      this.stopStream(cameraId);
    }
  }
}

export const streamProcessor = new StreamProcessor();

/**
 * Start processing all camera streams
 * @param {Object} io - Socket.IO instance
 */
export function startStreamProcessing(io) {
  console.log('🎥 Starting stream processing...');

  // Example: Start the default RTSP stream
  const defaultRtspUrl = process.env.RTSP_URL;
  if (defaultRtspUrl) {
    streamProcessor.startStream(defaultRtspUrl, 'default-camera', io);
  }
}
