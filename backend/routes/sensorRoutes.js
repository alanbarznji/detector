import express from 'express';
import { emitSensorData } from '../services/socketService.js';

const router = express.Router();

// Mock database
let sensors = [];

// Get all sensors
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: sensors
  });
});

// Get sensor by ID
router.get('/:id', (req, res) => {
  const sensor = sensors.find(s => s.id === req.params.id);

  if (!sensor) {
    return res.status(404).json({
      success: false,
      error: 'Sensor not found'
    });
  }

  res.json({
    success: true,
    data: sensor
  });
});

// Add new sensor
router.post('/', (req, res) => {
  const { name, type, unit, minValue, maxValue, threshold } = req.body;

  if (!name || !type) {
    return res.status(400).json({
      success: false,
      error: 'Name and type are required'
    });
  }

  const newSensor = {
    id: String(sensors.length + 1),
    name,
    type,
    status: 'working',
    currentValue: 0,
    unit: unit || '',
    minValue: minValue || 0,
    maxValue: maxValue || 100,
    threshold: threshold || { min: 0, max: 100 },
    createdAt: new Date()
  };

  sensors.push(newSensor);

  res.status(201).json({
    success: true,
    data: newSensor
  });
});

// Update sensor
router.put('/:id', (req, res) => {
  const index = sensors.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Sensor not found'
    });
  }

  sensors[index] = {
    ...sensors[index],
    ...req.body,
    id: req.params.id
  };

  res.json({
    success: true,
    data: sensors[index]
  });
});

// Update sensor reading
router.post('/:id/reading', (req, res) => {
  const { value } = req.body;
  const sensor = sensors.find(s => s.id === req.params.id);

  if (!sensor) {
    return res.status(404).json({
      success: false,
      error: 'Sensor not found'
    });
  }

  sensor.currentValue = value;
  sensor.lastUpdate = new Date();

  // Emit update to all clients
  emitSensorData({
    sensorId: sensor.id,
    value,
    timestamp: sensor.lastUpdate
  });

  res.json({
    success: true,
    data: sensor
  });
});

// Delete sensor
router.delete('/:id', (req, res) => {
  const index = sensors.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Sensor not found'
    });
  }

  sensors.splice(index, 1);

  res.json({
    success: true,
    message: 'Sensor deleted successfully'
  });
});

export default router;
