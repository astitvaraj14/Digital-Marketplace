const express = require("express");
const {
  getAdminDashboard,
  getUsers,
  toggleBlockUser,
  toggleApproveSeller,
  getAllProducts,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getAdminDashboard);
router.get("/users", getUsers);
router.put("/users/:id/block", toggleBlockUser);
router.put("/sellers/:id/approve", toggleApproveSeller);
router.get("/products", getAllProducts);

module.exports = router;
