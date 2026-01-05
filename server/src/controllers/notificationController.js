const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  const userId = req.user.userId;
  const notifications = await Notification.find({
    recipient: userId,
  })
    .sort({ createdAt: -1 })
    .populate("sender", "username")
    .populate("post", "_id");

  res.json(notifications);
};

exports.getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user.userId,
    read: false,
  });

  res.json({ count });
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("markAllAsRead error:", err.message);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};
