// Camera statuses
export const CameraStatus = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  LOADING: 'loading'
};

// Alert types
export const AlertType = {
  FIRE: 'fire',
  SMOKE: 'smoke',
  PPE_VIOLATION: 'ppe_violation',
  GAS: 'gas',
  TEMPERATURE: 'temperature',
  MOTION: 'motion'
};

// PPE violation types
export const PPEViolationType = {
  NO_HELMET: 'no_helmet',
  NO_VEST: 'no_vest',
  NO_GLOVES: 'no_gloves',
  NO_BOOTS: 'no_boots',
  NO_GOGGLES: 'no_goggles',
  NO_MASK: 'no_mask'
};

// Detection capabilities
export const DetectionType = {
  FIRE: 'fire',
  SMOKE: 'smoke',
  PPE: 'ppe',
  FIRE_AND_SMOKE: 'fire_and_smoke',
  ALL: 'all'
};

// Sensor statuses
export const SensorStatus = {
  WORKING: 'working',
  ERROR: 'error',
  DISCONNECTED: 'disconnected'
};

// Sensor types
export const SensorType = {
  GAS: 'gas',
  TEMPERATURE: 'temperature',
  MOTION: 'motion',
  HUMIDITY: 'humidity',
  PRESSURE: 'pressure'
};

// Severity levels
export const Severity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// User roles
export const UserRole = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer'
};

// Grid layouts
export const GridLayout = {
  ONE_BY_ONE: '1x1',
  TWO_BY_TWO: '2x2',
  THREE_BY_THREE: '3x3',
  FOUR_BY_FOUR: '4x4'
};

/**
 * Camera object structure
 * @typedef {Object} Camera
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} status - online | offline | loading
 * @property {string} streamUrl
 * @property {string} [lastFrame]
 * @property {Array} alerts
 * @property {Date} createdAt
 * @property {Array<string>} detectionCapabilities - What this camera can detect
 * @property {boolean} isDetectionActive - Whether detection is currently active
 */

/**
 * Sensor object structure
 * @typedef {Object} Sensor
 * @property {string} id
 * @property {string} name
 * @property {string} type - gas | temperature | motion | humidity | pressure
 * @property {string} status - working | error | disconnected
 * @property {number} currentValue
 * @property {string} unit
 * @property {number} minValue
 * @property {number} maxValue
 * @property {Object} threshold
 * @property {number} threshold.min
 * @property {number} threshold.max
 * @property {Array} alerts
 * @property {Date} createdAt
 */

/**
 * Alert object structure
 * @typedef {Object} Alert
 * @property {string} id
 * @property {string} type - fire | smoke | ppe_violation | gas | temperature | motion
 * @property {string} sourceType - camera | sensor
 * @property {string} sourceId
 * @property {string} sourceName
 * @property {Date} timestamp
 * @property {string} severity - low | medium | high | critical
 * @property {string} description
 * @property {boolean} resolved
 * @property {string} [resolvedBy]
 * @property {Date} [resolvedAt]
 * @property {string} [imageUrl]
 * @property {string} [ppeViolationType] - Specific PPE violation type if applicable
 * @property {Object} [detectionInfo] - Additional detection information
 */

/**
 * User object structure
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role - admin | operator | viewer
 * @property {string} [avatar]
 */

/**
 * Timeline Event object structure
 * @typedef {Object} TimelineEvent
 * @property {string} id
 * @property {string} type - alert | camera_offline | sensor_error | system
 * @property {Date} timestamp
 * @property {string} description
 * @property {string} icon
 * @property {string} severity - info | warning | error
 */

/**
 * Analytics Data object structure
 * @typedef {Object} AnalyticsData
 * @property {Array<{date: string, count: number}>} alertsPerDay
 * @property {Array<{type: string, count: number}>} alertsByType
 * @property {{online: number, offline: number}} cameraStatus
 * @property {Array<{name: string, alertCount: number}>} sensorActivity
 */

/**
 * App Settings object structure
 * @typedef {Object} AppSettings
 * @property {string} theme - light | dark
 * @property {Object} cameraSettings
 * @property {number} cameraSettings.reconnectInterval
 * @property {string} cameraSettings.streamQuality - low | medium | high
 * @property {Object} sensorSettings
 * @property {number} sensorSettings.updateInterval
 * @property {boolean} sensorSettings.autoAlert
 * @property {Object} notifications
 * @property {boolean} notifications.enabled
 * @property {boolean} notifications.sound
 * @property {boolean} notifications.email
 */
