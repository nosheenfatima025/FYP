const Notification = require("../models/Notification");

exports.getMyNotification = async (req,res) => {
    const notifications = await Notifications.findOne({userId:req.user.id}).sort({createdAt: -1});

    res.json(notifications);
};

exports.markAsRead = async (req,res) => {
    await Notification.findByIdAndUpdate(req.params.id, {isRead: true});

    res.json({message: "Notification marked as read"})
};