
const mongoose = require("mongoose");

const fraudLogSchema = new mongoose.Schema({
    numberPlate: { type: String, required: true },
    qrCode: { type: String, default: null },
    reason: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    severity: { type: String, default: "high" },
    description: { type: String },
    detectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FraudLog", fraudLogSchema);