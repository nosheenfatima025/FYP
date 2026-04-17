from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from ultralytics import YOLO
import easyocr
import cv2
import re
import os
import datetime
from PIL import Image
import numpy as np
import qrcode

app = Flask(__name__)
CORS(app)

# =====================
# MongoDB
# =====================
client = MongoClient("mongodb://localhost:27017/")
db = client["parkify"]

# =====================
# Model Setup
# =====================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "best.pt")

model = YOLO(MODEL_PATH)
reader = easyocr.Reader(['en'])

# =====================
# HOME
# =====================

@app.route("/")
def home():
    return "🚗 Parkify Backend is running successfully!"

print(" NEW QR REGISTER FUNCTION IS RUNNING")

# =====================
# REGISTER + QR FIXED
# =====================
@app.route('/api/register', methods=['POST'])
def register_vehicle():
    print("\n========== REGISTER HIT ==========")

    data = request.json
    print("REQUEST DATA:", data)

    if not data or "plate" not in data:
        print("ERROR: No plate")
        return jsonify({"success": False, "message": "Plate required"}), 400

    existing = db.vehicles.find_one({"plate": data["plate"]})
    if existing:
        print("ERROR: Already exists")
        return jsonify({"success": False, "message": "Plate already registered"}), 400

    print("Saving vehicle...")
    db.vehicles.insert_one(data)

    print("Generating QR...")

    qr = qrcode.make(data["plate"])

    qr_path = f"qr_codes/{data['plate']}.png"
    qr.save(qr_path)

    print("QR SAVED SUCCESSFULLY:", qr_path)

    return jsonify({
        "success": True,
        "message": "Vehicle registered and QR generated!",
        "qr_file": qr_path
    })

# =====================
# ENTRY
# =====================
@app.route('/api/entry', methods=['POST'])
def vehicle_entry():

    if 'image' not in request.files:
        return jsonify({"success": False, "message": "No image uploaded"}), 400

    file = request.files['image']

    img = Image.open(file).convert("RGB")
    img_array = np.array(img)
    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

    os.makedirs("uploads", exist_ok=True)
    temp_path = os.path.join("uploads", "temp.jpg")
    cv2.imwrite(temp_path, img_bgr)

    results = model.predict(source=temp_path, conf=0.25)
    plate_text = ""

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            plate = img_bgr[y1:y2, x1:x2]

            plate = cv2.resize(plate, None, fx=2, fy=2)
            plate = cv2.cvtColor(plate, cv2.COLOR_BGR2GRAY)

            text = reader.readtext(plate)
            full = " ".join([t[1] for t in text])
            plate_text = re.sub(r'[^A-Z0-9]', '', full.upper()).strip()

    if not plate_text:
        return jsonify({"success": False, "message": "Plate not detected"}), 400

    vehicle = db.vehicles.find_one({"plate": plate_text})
    if not vehicle:
        return jsonify({"success": False, "message": "Vehicle not registered"}), 404

    db.entry_logs.insert_one({
        "plate": plate_text,
        "entry_time": datetime.datetime.now(),
        "status": "parked"
    })

    return jsonify({
        "success": True,
        "plate": plate_text,
        "owner": vehicle.get("owner_name"),
        "message": "Entry recorded!"
    })

# =====================
# EXIT
# =====================
@app.route('/api/exit', methods=['POST'])
def vehicle_exit():

    if 'image' not in request.files:
        return jsonify({"success": False, "message": "No image uploaded"}), 400

    file = request.files['image']

    img = Image.open(file).convert("RGB")
    img_array = np.array(img)
    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

    os.makedirs("uploads", exist_ok=True)
    temp_path = os.path.join("uploads", "temp.jpg")
    cv2.imwrite(temp_path, img_bgr)

    results = model.predict(source=temp_path, conf=0.25)
    plate_text = ""

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            plate = img_bgr[y1:y2, x1:x2]

            plate = cv2.resize(plate, None, fx=2, fy=2)
            plate = cv2.cvtColor(plate, cv2.COLOR_BGR2GRAY)

            text = reader.readtext(plate)
            full = " ".join([t[1] for t in text])
            plate_text = re.sub(r'[^A-Z0-9]', '', full.upper()).strip()

    if not plate_text:
        return jsonify({"success": False, "message": "Plate not detected"}), 400

    log = db.entry_logs.find_one({"plate": plate_text, "status": "parked"})
    if not log:
        return jsonify({"success": False, "message": "Entry not found"}), 404

    exit_time = datetime.datetime.now()
    duration = exit_time - log["entry_time"]
    hours = max(1, int(duration.total_seconds() / 3600))

    rate = db.parking_rates.find_one({"type": "car"})
    rate_per_hour = rate["rate"] if rate else 50
    fee = hours * rate_per_hour

    vehicle = db.vehicles.find_one({"plate": plate_text})
    new_balance = vehicle.get("wallet", 0) - fee

    db.vehicles.update_one(
        {"plate": plate_text},
        {"$set": {"wallet": new_balance}}
    )

    db.entry_logs.update_one(
        {"_id": log["_id"]},
        {"$set": {
            "exit_time": exit_time,
            "duration_hours": hours,
            "fee": fee,
            "status": "exited"
        }}
    )

    return jsonify({
        "success": True,
        "plate": plate_text,
        "duration": f"{hours} hours",
        "fee": fee,
        "new_balance": new_balance,
        "message": "Exit recorded!"
    })

# =====================
# RUN SERVER
# =====================
if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("qr_codes", exist_ok=True)
    app.run(debug=True, port=5000, use_reloader=False)