const express = require("express");

const {
  getInventory,
  getLowStockProducts,
  adjustStock,
  getInventoryHistory
} = require("../controllers/inventoryController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Authentication required
router.use(protect);

// Only seller can access inventory
router.use(authorize("seller"));

// Get seller inventory
router.get("/", getInventory);

// Get low stock products
router.get("/low-stock", getLowStockProducts);

// Get inventory history
router.get("/history", getInventoryHistory);

// Update stock / Restock
router.patch("/:id/stock", adjustStock);

module.exports = router;