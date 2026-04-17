

// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     amount: { type: Number, required: true },
//     method: { type: String, enum: ["MANUAL", "WALLET"], default: "WALLET" },
//     status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Payment", paymentSchema);

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["MANUAL", "WALLET"], default: "WALLET" },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "SUCCESS" }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);