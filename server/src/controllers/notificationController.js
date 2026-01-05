const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  const userId = req.user.userId;
  const notifications = await Notification.find({
    recipient: userId,
  })
    .sort({ createdAt: -1 })
    .populate("sender", "username")
    .populate("post", "_id");

  console.log(
    "NOTIFICATIONS TYPES:",
    notifications.map((n) => n.type)
  );

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
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );

  res.json({ success: true });
};
