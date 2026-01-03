import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { emitAlert } from '../services/socketService.js';

const router = express.Router();

// Mock database
let alerts = [];

// Get all alerts
router.get('/', (req, res) => {
  const { resolved, type, sourceType, severity } = req.query;

  let filteredAlerts = [...alerts];

  if (resolved !== undefined) {
    filteredAlerts = filteredAlerts.filter(a => a.resolved === (resolved === 'true'));
  }

  if (type) {
    filteredAlerts = filteredAlerts.filter(a => a.type === type);
  }

  if (sourceType) {
    filteredAlerts = filteredAlerts.filter(a => a.sourceType === sourceType);
  }

  if (severity) {
    filteredAlerts = filteredAlerts.filter(a => a.severity === severity);
  }

  res.json({
    success: true,
    data: filteredAlerts
  });
});

// Get alert by ID
router.get('/:id', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      error: 'Alert not found'
    });
  }

  res.json({
    success: true,
    data: alert
  });
});

// Create new alert
router.post('/', (req, res) => {
  const {
    type,
    sourceType,
    sourceId,
    sourceName,
    severity,
    description,
    imageUrl,
    ppeViolationType,
    detectionInfo
  } = req.body;

  if (!type || !sourceType || !sourceId || !severity || !description) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  const newAlert = {
    id: uuidv4(),
    type,
    sourceType,
    sourceId,
    sourceName: sourceName || 'Unknown',
    timestamp: new Date(),
    severity,
    description,
    resolved: false,
    imageUrl: imageUrl || null,
    ppeViolationType: ppeViolationType || null,
    detectionInfo: detectionInfo || null
  };

  alerts.push(newAlert);

  // Emit to all connected clients
  emitAlert(newAlert);

  res.status(201).json({
    success: true,
    data: newAlert
  });
});

// Resolve alert
router.put('/:id/resolve', (req, res) => {
  const { resolvedBy } = req.body;
  const index = alerts.findIndex(a => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Alert not found'
    });
  }

  alerts[index] = {
    ...alerts[index],
    resolved: true,
    resolvedBy: resolvedBy || 'System',
    resolvedAt: new Date()
  };

  // Emit update
  emitAlert(alerts[index]);

  res.json({
    success: true,
    data: alerts[index]
  });
});

// Delete alert
router.delete('/:id', (req, res) => {
  const index = alerts.findIndex(a => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Alert not found'
    });
  }

  alerts.splice(index, 1);

  res.json({
    success: true,
    message: 'Alert deleted successfully'
  });
});

// Get alert statistics
router.get('/stats/summary', (req, res) => {
  const stats = {
    total: alerts.length,
    active: alerts.filter(a => !a.resolved).length,
    resolved: alerts.filter(a => a.resolved).length,
    byType: {},
    bySeverity: {},
    bySource: {}
  };

  alerts.forEach(alert => {
    // By type
    stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;

    // By severity
    stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1;

    // By source
    stats.bySource[alert.sourceType] = (stats.bySource[alert.sourceType] || 0) + 1;
  });

  res.json({
    success: true,
    data: stats
  });
});

export default router;
