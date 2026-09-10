const express = require("express");
const { getSellerDashboard, getSellerOrders } = require("../controllers/sellerController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("seller"));

router.get("/dashboard", getSellerDashboard);
router.get("/orders", getSellerOrders);

module.exports = router;
