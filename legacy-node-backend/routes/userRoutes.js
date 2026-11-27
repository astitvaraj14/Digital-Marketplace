const express = require("express");

const {
  getProfile,
  updateProfile,
  changePassword,
  getAccountStatus
} = require("../controllers/userController");

const {
  protect
} = require("../middleware/auth");

const router = express.Router();


// All user routes require authentication
router.use(protect);


// Get current user profile
router.get("/profile", getProfile);


// Update current user profile
router.put("/profile", updateProfile);


// Change current password
router.put("/password", changePassword);


// Get account status
router.get("/account-status", getAccountStatus);


module.exports = router;