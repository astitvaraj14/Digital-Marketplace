const express = require("express");
const {
  getProducts,
  getProductById,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getProducts);
router.get(
  "/seller/mine",
  protect,
  authorize("seller"),
  getSellerProducts
);
router.get("/:id", getProductById);
router.post(
  "/",
  protect,
  authorize("seller"),
  createProduct
);
router.put(
  "/:id",
  protect,
  authorize("seller", "admin"),
  updateProduct
);
router.delete(
  "/:id",
  protect,
  authorize("seller", "admin"),
  deleteProduct
);

module.exports = router;
