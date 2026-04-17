const express = require("express");
const router = express.Router();
const FraudLog = require("../models/FraudLog");

// Get all fraud logs
router.get("/all", async (req, res) => {
    try {
        const logs = await FraudLog.find().sort({ createdAt: -1 }).limit(200);
        res.json(logs);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Manual add
router.post("/manual", async (req, res) => {
    try {
        const log = await FraudLog.create({
            plateNumber: req.body.plateNumber,
            alertType: req.body.alertType,
            severity: req.body.severity || "high",
            description: req.body.description,
            resolved: false
        });
        res.json(log);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Resolve one
router.put("/:id/resolve", async (req, res) => {
    try {
        const log = await FraudLog.findByIdAndUpdate(
            req.params.id,
            { resolved: true, resolvedAt: new Date() },
            { new: true }
        );
        res.json(log);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Resolve all
router.put("/resolve-all", async (req, res) => {
    try {
        await FraudLog.updateMany({ resolved: false }, { resolved: true, resolvedAt: new Date() });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete/dismiss
router.delete("/:id", async (req, res) => {
    try {
        await FraudLog.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;