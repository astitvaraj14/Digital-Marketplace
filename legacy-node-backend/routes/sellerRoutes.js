const express = require("express");

const {
  getSellerProfile,
  updateSellerProfile,
  getSellerDashboard,
} = require("../controllers/sellerController");

const {
  protect,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("seller"));

router.get("/profile", getSellerProfile);
router.put("/profile", updateSellerProfile);
router.get("/dashboard", getSellerDashboard);

module.exports = router;