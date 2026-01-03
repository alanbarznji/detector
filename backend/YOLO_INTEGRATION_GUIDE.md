# YOLO Integration Guide

## Overview
This guide explains how to integrate YOLO (You Only Look Once) object detection with the Detector Backend system for real-time fire, smoke, and PPE detection.

## Prerequisites

- Python 3.8+
- YOLO model (YOLOv5, YOLOv8, or custom trained model)
- GPU recommended for real-time processing

## Architecture

```
RTSP Stream → FFmpeg → Frame Extraction → YOLO API → Detection Results → Backend → Frontend
```

## Option 1: YOLO as Python Microservice (Recommended)

### 1. Create YOLO Service Directory

```bash
mkdir yolo-service
cd yolo-service
```

### 2. Install Dependencies

```bash
pip install torch torchvision
pip install ultralytics  # for YOLOv8
# OR
pip install yolov5      # for YOLOv5

pip install flask flask-cors opencv-python pillow numpy
```

### 3. Create YOLO Detection Server

**File: `yolo-service/app.py`**

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import io
import base64
from ultralytics import YOLO  # YOLOv8
# OR: import torch; model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

app = Flask(__name__)
CORS(app)

# Load your trained model
# Replace with your custom model path
model = YOLO('yolov8n.pt')  # Or your custom model

# Define detection classes
DETECTION_CLASSES = {
    'fire': 0,
    'smoke': 1,
    'person': 2,
    'helmet': 3,
    'vest': 4,
    'no_helmet': 5,
    'no_vest': 6
}

# PPE mapping
PPE_ITEMS = {
    'helmet': 'helmet',
    'vest': 'vest',
    'gloves': 'gloves',
    'boots': 'boots',
    'goggles': 'goggles',
    'mask': 'mask'
}

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model': 'YOLOv8',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/detect', methods=['POST'])
def detect():
    """
    Endpoint to detect objects in an image
    Expects: base64 encoded image or image file
    Returns: Detection results
    """
    try:
        # Get image from request
        if 'image' in request.files:
            # File upload
            image_file = request.files['image']
            image = Image.open(image_file.stream)
        elif 'image_base64' in request.json:
            # Base64 encoded
            image_data = base64.b64decode(request.json['image_base64'])
            image = Image.open(io.BytesIO(image_data))
        else:
            return jsonify({'error': 'No image provided'}), 400

        # Convert to numpy array
        img_array = np.array(image)

        # Run inference
        results = model(img_array)

        # Process results
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                detection = {
                    'class': result.names[int(box.cls[0])],
                    'confidence': float(box.conf[0]),
                    'bbox': box.xyxy[0].tolist(),
                    'class_id': int(box.cls[0])
                }
                detections.append(detection)

        # Analyze detections
        analysis = analyze_detections(detections)

        return jsonify({
            'success': True,
            'detections': detections,
            'analysis': analysis,
            'count': len(detections)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def analyze_detections(detections):
    """Analyze detections to create alerts"""
    alerts = []

    # Check for fire
    fire_detections = [d for d in detections if d['class'] == 'fire' and d['confidence'] > 0.5]
    if fire_detections:
        alerts.append({
            'type': 'fire',
            'severity': 'critical',
            'confidence': max([d['confidence'] for d in fire_detections]),
            'count': len(fire_detections)
        })

    # Check for smoke
    smoke_detections = [d for d in detections if d['class'] == 'smoke' and d['confidence'] > 0.5]
    if smoke_detections:
        alerts.append({
            'type': 'smoke',
            'severity': 'high',
            'confidence': max([d['confidence'] for d in smoke_detections]),
            'count': len(smoke_detections)
        })

    # Check for PPE violations
    persons = [d for d in detections if d['class'] == 'person']
    helmets = [d for d in detections if d['class'] == 'helmet']
    vests = [d for d in detections if d['class'] == 'vest']

    if len(persons) > len(helmets):
        alerts.append({
            'type': 'ppe_violation',
            'ppeViolationType': 'no_helmet',
            'severity': 'medium',
            'missingItems': ['helmet'],
            'personCount': len(persons),
            'helmetCount': len(helmets)
        })

    if len(persons) > len(vests):
        alerts.append({
            'type': 'ppe_violation',
            'ppeViolationType': 'no_vest',
            'severity': 'medium',
            'missingItems': ['vest'],
            'personCount': len(persons),
            'vestCount': len(vests)
        })

    return {
        'alerts': alerts,
        'person_count': len(persons),
        'has_fire': len(fire_detections) > 0,
        'has_smoke': len(smoke_detections) > 0,
        'ppe_compliant': len(alerts) == 0
    }

@app.route('/detect/stream', methods=['POST'])
def detect_stream():
    """Process RTSP stream frame"""
    # This endpoint will be called by the backend for each frame
    return detect()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
```

### 4. Run YOLO Service

```bash
python app.py
```

The service will run on `http://localhost:8000`

---

## Option 2: Direct Integration with Backend

### File: `backend/services/yoloService.js`

```javascript
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

class YOLOService {
  constructor() {
    this.apiUrl = process.env.YOLO_API_URL || 'http://localhost:8000';
    this.confidenceThreshold = parseFloat(process.env.YOLO_CONFIDENCE_THRESHOLD) || 0.5;
  }

  /**
   * Send image to YOLO for detection
   * @param {string} imagePath - Path to image file
   * @returns {Promise<Object>} Detection results
   */
  async detectFromFile(imagePath) {
    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      const response = await axios.post(`${this.apiUrl}/detect`, formData, {
        headers: formData.getHeaders(),
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('YOLO detection error:', error.message);
      throw error;
    }
  }

  /**
   * Send base64 image to YOLO
   * @param {string} base64Image - Base64 encoded image
   * @returns {Promise<Object>} Detection results
   */
  async detectFromBase64(base64Image) {
    try {
      const response = await axios.post(`${this.apiUrl}/detect`, {
        image_base64: base64Image
      }, {
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('YOLO detection error:', error.message);
      throw error;
    }
  }

  /**
   * Check YOLO service health
   * @returns {Promise<boolean>} Service status
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.apiUrl}/health`, {
        timeout: 5000
      });
      return response.data.status === 'ok';
    } catch (error) {
      return false;
    }
  }

  /**
   * Process detection results and create alerts
   * @param {Object} detections - YOLO detection results
   * @param {string} cameraId - Camera ID
   * @returns {Array} Array of alerts
   */
  processDetections(detections, cameraId) {
    if (!detections.analysis || !detections.analysis.alerts) {
      return [];
    }

    const alerts = [];

    for (const alert of detections.analysis.alerts) {
      alerts.push({
        type: alert.type,
        sourceType: 'camera',
        sourceId: cameraId,
        severity: alert.severity,
        description: this.getAlertDescription(alert),
        ppeViolationType: alert.ppeViolationType || null,
        detectionInfo: {
          confidence: alert.confidence,
          detectionType: alert.type,
          missingItems: alert.missingItems || []
        }
      });
    }

    return alerts;
  }

  getAlertDescription(alert) {
    switch (alert.type) {
      case 'fire':
        return `تم اكتشاف حريق - دقة الكشف ${Math.round(alert.confidence * 100)}%`;
      case 'smoke':
        return `تم اكتشاف دخان - دقة الكشف ${Math.round(alert.confidence * 100)}%`;
      case 'ppe_violation':
        if (alert.ppeViolationType === 'no_helmet') {
          return `عامل بدون خوذة - ${alert.personCount} شخص، ${alert.helmetCount} خوذة`;
        } else if (alert.ppeViolationType === 'no_vest') {
          return `عامل بدون سترة سلامة - ${alert.personCount} شخص، ${alert.vestCount} سترة`;
        }
        return 'مخالفة معدات السلامة';
      default:
        return 'تنبيه من نظام الكشف';
    }
  }
}

export const yoloService = new YOLOService();
```

---

## Training Custom YOLO Model

### 1. Prepare Dataset

Collect and label images for:
- Fire
- Smoke
- Person (with/without helmet)
- Person (with/without vest)
- Person (with/without other PPE)

Use tools like:
- [Roboflow](https://roboflow.com)
- [LabelImg](https://github.com/tzutalin/labelImg)
- [CVAT](https://cvat.org)

### 2. Train YOLOv8

```python
from ultralytics import YOLO

# Load a model
model = YOLO('yolov8n.yaml')  # build a new model from scratch

# Train the model
results = model.train(
    data='dataset.yaml',  # path to dataset YAML
    epochs=100,
    imgsz=640,
    batch=16,
    name='fire_smoke_ppe_detector'
)

# Export model
model.export(format='onnx')  # export to ONNX format
```

### 3. Dataset YAML Example

```yaml
# dataset.yaml
path: /path/to/dataset
train: images/train
val: images/val

nc: 7  # number of classes
names: ['fire', 'smoke', 'person', 'helmet', 'vest', 'no_helmet', 'no_vest']
```

---

## Integration with Backend

### Update `backend/services/streamProcessor.js`

```javascript
import { yoloService } from './yoloService.js';
import { emitAlert } from './socketService.js';

// In your frame processing loop:
async function processFrame(imagePath, cameraId) {
  try {
    // Run YOLO detection
    const detections = await yoloService.detectFromFile(imagePath);

    // Process and create alerts
    const alerts = yoloService.processDetections(detections, cameraId);

    // Emit alerts
    for (const alert of alerts) {
      emitAlert(alert);
    }

    return detections;
  } catch (error) {
    console.error('Frame processing error:', error);
  }
}
```

---

## Testing

```bash
# Test YOLO service
curl -X GET http://localhost:8000/health

# Test detection with image
curl -X POST http://localhost:8000/detect \
  -F "image=@test_image.jpg"
```

---

## Performance Optimization

1. **Use GPU**: Ensure CUDA is installed for faster inference
2. **Batch Processing**: Process multiple frames together
3. **Model Optimization**: Use TensorRT or ONNX for faster inference
4. **Frame Skipping**: Process every Nth frame instead of all frames
5. **Async Processing**: Use worker threads for parallel processing

---

## Deployment

### Docker Container (Recommended)

```dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t yolo-service .
docker run -p 8000:8000 yolo-service
```

---

## Next Steps

1. Train your custom YOLO model with your specific dataset
2. Deploy YOLO service
3. Update backend `.env` with YOLO API URL
4. Test integration
5. Monitor performance and adjust threshold

For questions or issues, refer to:
- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [YOLOv5 Documentation](https://github.com/ultralytics/yolov5)
