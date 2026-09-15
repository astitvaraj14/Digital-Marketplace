const express = require("express");

const {
  getProducts,
  getProductById,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const {
  protect,
  authorize
} = require("../middleware/auth");

const router = express.Router();

// Public product listing
router.get("/", getProducts);

// Seller's own products
router.get(
  "/seller/my-products",
  protect,
  authorize("seller"),
  getSellerProducts
);

// Individual product
router.get("/:id", getProductById);

// Create product
router.post(
  "/",
  protect,
  authorize("seller"),
  createProduct
);

// Update product
router.put(
  "/:id",
  protect,
  authorize("seller", "admin"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  authorize("seller", "admin"),
  deleteProduct
);

module.exports = router;
