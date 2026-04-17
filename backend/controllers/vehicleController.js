

// const addVehicle = async (req, res) => {
//     res.status(201).json({ message: "Vehicle added" });
// };

// const getMyVehicles = async (req, res) => {
//     res.status(200).json({ vehicles: [] });
// };

// const deactivateVehicle = async (req, res) => {
//     const { id } = req.params;
//     res.status(200).json({ message: `Vehicle ${id} deactivated` });
// };

// module.exports = {
//     addVehicle,
//     getMyVehicles,
//     deactivateVehicle,
// };

const Vehicle = require("../models/Vehicle");
const User = require("../models/User");

exports.addVehicle = async (req, res) => {
    try {
        const { plateNumber, userId } = req.body;
        if (!plateNumber || !userId)
            return res.status(400).json({ message: "plateNumber and userId required" });

        const exists = await Vehicle.findOne({ plateNumber });
        if (exists) return res.status(400).json({ message: "Vehicle already registered" });

        const QRCode = require("qrcode");
        const qrCode = await QRCode.toDataURL(JSON.stringify({ plateNumber, userId }));

        const vehicle = await Vehicle.create({ userId, plateNumber, qrCode });
        res.status(201).json({ message: "Vehicle added successfully", vehicle });
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
        const vehicles = await Vehicle.find({ userId: req.user._id });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deactivateVehicle = async (req, res) => {
    try {
        await Vehicle.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ message: "Vehicle deactivated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
