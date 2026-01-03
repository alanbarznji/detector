# YOLO Detection Service

This is the AI-based detection service for fire, smoke, and PPE violations.

## Quick Start

### 1. Install Python Dependencies

```bash
# Install all required packages
pip install -r requirements.txt
```

### 2. Download YOLO Model

The service uses YOLOv8. On first run, it will automatically download the base model (`yolov8n.pt`).

For custom trained models:
- Replace `yolov8n.pt` in `app.py` with your custom model path
- Place your custom model file (`.pt`) in this directory

### 3. Run the Service

```bash
python app.py
```

The service will start on: **http://localhost:8000**

## Testing the Service

### Health Check:
```bash
curl http://localhost:8000/health
```

### Test Detection with Image:
```bash
curl -X POST http://localhost:8000/detect \
  -F "image=@test_image.jpg"
```

## API Endpoints

### `GET /health`
Check if service is running

**Response:**
```json
{
  "status": "ok",
  "model": "YOLOv8",
  "timestamp": "2025-01-03T..."
}
```

### `POST /detect`
Detect objects in an image

**Request (File Upload):**
```bash
curl -X POST http://localhost:8000/detect -F "image=@image.jpg"
```

**Request (Base64):**
```json
{
  "image_base64": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "success": true,
  "detections": [
    {
      "class": "fire",
      "confidence": 0.95,
      "bbox": [x1, y1, x2, y2],
      "class_id": 0
    }
  ],
  "analysis": {
    "alerts": [
      {
        "type": "fire",
        "severity": "critical",
        "confidence": 0.95,
        "count": 1
      }
    ],
    "person_count": 0,
    "has_fire": true,
    "has_smoke": false,
    "ppe_compliant": true
  },
  "count": 1
}
```

## Detection Classes

Current model detects:
- **Fire**: Fire detection
- **Smoke**: Smoke detection
- **Person**: People detection
- **Helmet**: Safety helmet
- **Vest**: Safety vest
- **No Helmet**: Person without helmet
- **No Vest**: Person without vest

## Training Custom Model

To train a custom YOLO model for fire/smoke/PPE:

1. **Collect & Label Data**
   - Use [Roboflow](https://roboflow.com) or [LabelImg](https://github.com/tzutalin/labelImg)
   - Label images with: fire, smoke, person, helmet, vest, etc.

2. **Create Dataset YAML**
```yaml
# dataset.yaml
path: /path/to/dataset
train: images/train
val: images/val

nc: 7  # number of classes
names: ['fire', 'smoke', 'person', 'helmet', 'vest', 'no_helmet', 'no_vest']
```

3. **Train Model**
```python
from ultralytics import YOLO

# Load base model
model = YOLO('yolov8n.yaml')

# Train
results = model.train(
    data='dataset.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    name='fire_smoke_ppe_detector'
)

# Export
model.export(format='onnx')
```

4. **Use Custom Model**
   - Copy trained model to `yolo-service/`
   - Update `app.py`: `model = YOLO('your_custom_model.pt')`

## GPU Acceleration

For faster inference, install CUDA:

```bash
# For CUDA 11.8
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

Check GPU usage:
```python
import torch
print(f"CUDA Available: {torch.cuda.is_available()}")
print(f"GPU: {torch.cuda.get_device_name(0)}")
```

## Troubleshooting

### Error: "No module named 'ultralytics'"
```bash
pip install ultralytics
```

### Error: "Could not load model"
- Ensure model file exists
- Check model path in `app.py`
- Download default model: `yolo predict model=yolov8n.pt`

### Low Detection Accuracy
- Adjust confidence threshold in `analyze_detections()`
- Train custom model with your specific data
- Use larger model: `yolov8m.pt` or `yolov8l.pt`

## Integration with Backend

The backend is already configured to connect to this service at `http://localhost:8000`.

Check `backend/.env`:
```env
YOLO_API_URL=http://localhost:8000
YOLO_CONFIDENCE_THRESHOLD=0.5
```

## Performance Tips

1. **Use smaller model for speed**: `yolov8n.pt` (nano)
2. **Use larger model for accuracy**: `yolov8l.pt` (large)
3. **Enable GPU**: Install CUDA for 10-20x speedup
4. **Batch processing**: Process multiple frames together
5. **Frame skipping**: Process every Nth frame instead of all frames

## Resources

- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [Training Guide](https://docs.ultralytics.com/modes/train/)
- [Model Export](https://docs.ultralytics.com/modes/export/)
