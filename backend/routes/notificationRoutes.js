const express = require("express");
const { getMyNotifications, markAsRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.put("/:id/read", protect, markAsRead);

module.exports = router;
