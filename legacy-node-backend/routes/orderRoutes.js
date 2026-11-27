const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/* SELLER ORDERS */
router.get(
  "/seller/orders",
  protect,
  authorize("seller"),
  getSellerOrders
);

/* CUSTOMER ORDERS */
router.post(
  "/",
  protect,
  authorize("customer"),
  createOrder
);

router.get(
  "/my-orders",
  protect,
  authorize("customer"),
  getMyOrders
);

router.get(
  "/:id",
  protect,
  authorize("customer"),
  getOrderById
);

module.exports = router;