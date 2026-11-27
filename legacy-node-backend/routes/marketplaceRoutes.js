const express = require("express");
const {
  getMarketplaceProducts, getCategories
} = require("../controllers/marketplaceController");

const router = express.Router();

router.get("/products", getMarketplaceProducts);
router.get("/categories", getCategories);

module.exports = router;
