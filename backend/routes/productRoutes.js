const express = require("express");

const {
  getProducts,
  getProductById,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.get("/", getProducts);

router.get(
  "/seller/my-products",
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
  authorize("seller"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("seller"),
  deleteProduct
);

module.exports = router;