const express = require("express");
const { getCart, addToCart, updateCartItem, removeFromCart } = require("../controllers/cartController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect, authorize("customer"));
router.get("/", getCart);
router.post("/", addToCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeFromCart);

module.exports = router;
