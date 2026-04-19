const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.post("/", async (req, res) => {
    try {
        const { userId, title, message } = req.body;
        if (!userId || !title || !message) {
            return res.status(400).json({ message: "userId, title aur message required hain" });
        }
        const notification = await Notification.create({ userId, title, message });
        res.status(201).json(notification);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/:userId", async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put("/:id/read", async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(notification);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put("/read-all/:userId", async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.params.userId }, { isRead: true });
        res.json({ message: "All notifications marked as read" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete("/:id", async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: "Notification deleted" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
