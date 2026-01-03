#!/usr/bin/env python3
"""
Test script for YOLO Detection Service
"""
import requests
import json
import sys

YOLO_URL = 'http://localhost:8000'

def test_health():
    """Test health endpoint"""
    print('🏥 Testing health endpoint...')
    try:
        response = requests.get(f'{YOLO_URL}/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f'✅ Service is healthy!')
            print(f'   Model: {data.get("model")}')
            print(f'   Status: {data.get("status")}')
            print(f'   Timestamp: {data.get("timestamp")}')
            return True
        else:
            print(f'❌ Health check failed: {response.status_code}')
            return False
    except requests.exceptions.ConnectionError:
        print('❌ Cannot connect to YOLO service')
        print('   Make sure the service is running: python app.py')
        return False
    except Exception as e:
        print(f'❌ Error: {e}')
        return False

def test_detection_with_image(image_path):
    """Test detection with an image file"""
    print(f'\n🔍 Testing detection with image: {image_path}')
    try:
        with open(image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(f'{YOLO_URL}/detect', files=files, timeout=30)

        if response.status_code == 200:
            data = response.json()
            print(f'✅ Detection successful!')
            print(f'   Detections found: {data.get("count")}')

            if data.get('detections'):
                print('\n📊 Detections:')
                for det in data['detections']:
                    print(f'   - {det["class"]}: {det["confidence"]:.2%} confidence')

            if data.get('analysis', {}).get('alerts'):
                print('\n⚠️  Alerts:')
                for alert in data['analysis']['alerts']:
                    print(f'   - {alert["type"]}: {alert["severity"]} severity')

            print(f'\n📈 Analysis Summary:')
            analysis = data.get('analysis', {})
            print(f'   Person count: {analysis.get("person_count", 0)}')
            print(f'   Has fire: {analysis.get("has_fire", False)}')
            print(f'   Has smoke: {analysis.get("has_smoke", False)}')
            print(f'   PPE compliant: {analysis.get("ppe_compliant", True)}')

            return True
        else:
            print(f'❌ Detection failed: {response.status_code}')
            print(f'   Response: {response.text}')
            return False

    except FileNotFoundError:
        print(f'❌ Image file not found: {image_path}')
        return False
    except Exception as e:
        print(f'❌ Error: {e}')
        return False

def main():
    print('='*60)
    print('YOLO Detection Service Test')
    print('='*60)

    # Test health
    if not test_health():
        print('\n❌ Service is not running. Start it with: python app.py')
        sys.exit(1)

    # Test with image if provided
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        test_detection_with_image(image_path)
    else:
        print('\n💡 To test with an image, run:')
        print('   python test_service.py path/to/image.jpg')

    print('\n' + '='*60)
    print('✅ All tests completed!')
    print('='*60)

if __name__ == '__main__':
    main()
