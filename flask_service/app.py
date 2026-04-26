from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import numpy as np
import io
import os
import re

app = Flask(__name__)
CORS(app, origins="*")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")
print("Loading YOLO model...")
model = YOLO(MODEL_PATH)
print("Model loaded!")

def clean_plate(text):
    text = text.upper().strip()
    text = re.sub(r'[^A-Z0-9\-]', '', text)
    return text

@app.route('/detect', methods=['POST'])
def detect_plate():
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'message': 'No image provided'}), 400

        file = request.files['image']
        img_bytes = file.read()
        
        # Use PIL instead of cv2
        pil_img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

        # YOLO detection
        results = model(pil_img, conf=0.3)
        
        plates = []
        for result in results:
            # Try to get text from YOLO results directly
            if hasattr(result, 'boxes') and result.boxes is not None:
                for i, box in enumerate(result.boxes):
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    conf = float(box.conf[0])
                    
                    # Crop plate using PIL
                    plate_img = pil_img.crop((x1, y1, x2, y2))
                    
                    # Try EasyOCR if available
                    try:
                        import easyocr
                        plate_arr = np.array(plate_img)
                        reader = easyocr.Reader(['en'], gpu=False)
                        ocr_results = reader.readtext(plate_arr)
                        plate_text = " ".join([text for (_, text, c) in ocr_results if c > 0.3])
                        plate_text = clean_plate(plate_text)
                    except:
                        plate_text = f"PLATE-{i+1}"
                    
                    if plate_text:
                        plates.append({
                            'plate': plate_text,
                            'confidence': round(conf * 100, 1),
                            'bbox': [x1, y1, x2, y2]
                        })

        if plates:
            best = max(plates, key=lambda x: x['confidence'])
            return jsonify({
                'success': True,
                'plate': best['plate'],
                'confidence': best['confidence'],
                'all_plates': plates
            })
        else:
            return jsonify({
                'success': False,
                'message': 'No plate detected',
                'plate': None
            })

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'running', 'model': 'YOLOv8 ANPR'})

if __name__ == '__main__':
    print("Starting Flask ANPR service on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)
