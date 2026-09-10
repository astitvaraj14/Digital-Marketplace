const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort("-createdAt").limit(50);
  res.json({ success: true, message: "OK", data: notifications });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  notification.read = true;
  await notification.save();
  res.json({ success: true, message: "Marked as read", data: notification });
});

module.exports = { getMyNotifications, markAsRead };
