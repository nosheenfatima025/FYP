const Notification = require("../models/Notification");

exports.createNotification = async (req, res) => {
    try {
        const { userId, title, message } = req.body;

        if (!userId || !title || !message) {
            return res.status(400).json({ message: "userId, title aur message required hain" });
        }

        const notification = await Notification.create({
            userId,
            title,
            message
        });

        res.status(201).json(notification);
    } catch (err) {
        console.error("createNotification ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getMyNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.params.userId
        }).sort({ createdAt: -1 });

        res.json(notifications);
    } catch (err) {
        console.error("getMyNotification ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification nahi mili" });
        }

        res.json({ message: "Notification marked as read" });
    } catch (err) {
        console.error("markAsRead ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.params.userId },
            { isRead: true }
        );

        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        console.error("markAllAsRead ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
};