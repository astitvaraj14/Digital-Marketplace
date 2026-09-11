const express = require("express");

const {
  getAdminDashboard,
  getAllUsers,
  getPendingSellers,
  approveSeller,
  rejectSeller,
  blockUser,
  unblockUser
} = require("../controllers/adminController");

const {
  protect,
  authorize
} = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getAdminDashboard);

router.get("/users", getAllUsers);

router.get("/sellers/pending", getPendingSellers);

router.patch("/sellers/:id/approve", approveSeller);

router.delete("/sellers/:id/reject", rejectSeller);

router.patch("/users/:id/block", blockUser);

router.patch("/users/:id/unblock", unblockUser);

module.exports = router;