from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import io
import base64
from datetime import datetime
from ultralytics import YOLO

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
        elif request.is_json and 'image_base64' in request.json:
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
    print('🚀 Starting YOLO Detection Service...')
    print('📡 Server running on http://localhost:8000')
    print('✅ Health check: http://localhost:8000/health')
    app.run(host='0.0.0.0', port=8000, debug=False)
