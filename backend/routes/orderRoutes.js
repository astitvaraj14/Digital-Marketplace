const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("customer"), createOrder);
router.get("/mine", authorize("customer"), getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", authorize("admin", "seller"), updateOrderStatus);

module.exports = router;
