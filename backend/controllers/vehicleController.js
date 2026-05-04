const Vehicle = require("../models/Vehicle");
const QRCode = require("qrcode");

exports.addVehicle = async (req, res) => {
    try {
        const { plateNumber } = req.body;
        const userId = req.user._id;

        if (!plateNumber) {
            return res.status(400).json({ message: "plateNumber required" });
        }

        const exists = await Vehicle.findOne({ plateNumber });
        if (exists) {
            return res.status(400).json({ message: "Vehicle already registered" });
        }

        const qrCode = await QRCode.toDataURL(
            JSON.stringify({ plateNumber, userId })
        );

        const vehicle = await Vehicle.create({
            userId,
            plateNumber,
            qrCode,
            isActive: true
        });

        res.status(201).json({
            message: "Vehicle added successfully",
            vehicle
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
            .populate("userId", "name phone email")
            .sort({ createdAt: -1 });

        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({
            userId: req.user._id,
            isActive: true
        });

        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deactivateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        if (
            vehicle.userId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        vehicle.isActive = false;
        await vehicle.save();

        res.json({ message: "Vehicle deactivated" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};