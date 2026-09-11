const express = require("express");
const {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/seller/mine", protect, authorize("seller"), getMyProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, authorize("seller"), createProduct);
router.put("/:id", protect, authorize("seller", "admin"), updateProduct);
router.delete("/:id", protect, authorize("seller", "admin"), deleteProduct);

module.exports = router;
