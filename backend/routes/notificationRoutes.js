const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Get all notifications for a user
router.get("/:userId", async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Mark one as read
router.put("/:id/read", async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.json(notification);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Mark all as read for a user
router.put("/read-all/:userId", async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.params.userId, isRead: false },
            { isRead: true }
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create notification (internal use / admin)
router.post("/", async (req, res) => {
    try {
        const notification = await Notification.create({
            userId: req.body.userId,
            title: req.body.title,
            message: req.body.message,
            type: req.body.type || "general"
        });
        res.json(notification);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete one notification
router.delete("/:id", async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;