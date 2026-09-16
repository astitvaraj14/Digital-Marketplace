const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("customer"));

router.get("/", getCart);
router.post("/", addToCart);
router.put("/item/:productId", updateCartItem);
router.delete("/item/:productId", removeFromCart);
router.delete("/", clearCart);

module.exports = router;
