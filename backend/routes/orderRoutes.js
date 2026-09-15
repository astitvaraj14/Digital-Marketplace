const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getSellerOrders,
  updateItemStatus,
  getAllOrders,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("customer"), placeOrder);
router.get("/my", protect, authorize("customer"), getMyOrders);
router.get("/seller", protect, authorize("seller"), getSellerOrders);
router.put("/:orderId/item/:productId/status", protect, authorize("seller"), updateItemStatus);
router.get("/", protect, authorize("admin"), getAllOrders);

module.exports = router;
