const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
    type: { type: String, default: "GENERAL" }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);