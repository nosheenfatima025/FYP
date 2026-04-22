
const mongoose = require("mongoose");

const entryExitLogSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    entryTime: { type: Date, required: true },
    exitTime: { type: Date, default: null },
    durationMinutes: { type: Number, default: 0 },
    amountCharged: { type: Number, default: 0 },
    status: { type: String, enum: ["IN", "OUT"], default: "IN" }
}, { timestamps: true });

module.exports = mongoose.model("EntryExitLog", entryExitLogSchema);
