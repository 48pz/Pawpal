const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const notificationController = require("../../controllers/notificationController");

router.get("/", auth, notificationController.getNotifications);

router.get("/unread-count", auth, notificationController.getUnreadCount);
router.post("/mark-read", auth, notificationController.markAllAsRead);

module.exports = router;
