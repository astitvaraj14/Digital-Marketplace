const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get seller stats/dashboard summary
// @route   GET /api/seller/dashboard
// @access  Private (Seller)
const getSellerDashboard = asyncHandler(async (req, res) => {
  const products = await Product.find({ sellerId: req.user._id });
  const productIds = products.map((p) => p._id);

  // Find orders containing seller's products
  const orders = await Order.find({ "items.productId": { $in: productIds } });

  let totalSales = 0;
  let itemsSold = 0;

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (productIds.some((id) => id.toString() === item.productId.toString())) {
        totalSales += item.price * item.quantity;
        itemsSold += item.quantity;
      }
    });
  });

  res.json({
    success: true,
    data: {
      totalProducts: products.length,
      totalSales,
      itemsSold,
      totalOrders: orders.length,
      isApproved: req.user.isApproved,
    },
  });
});

// @desc    Get orders for seller's products
// @route   GET /api/seller/orders
// @access  Private (Seller)
const getSellerOrders = asyncHandler(async (req, res) => {
  const products = await Product.find({ sellerId: req.user._id });
  const productIds = products.map((p) => p._id);

  const orders = await Order.find({ "items.productId": { $in: productIds } })
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: orders,
  });
});

module.exports = {
  getSellerDashboard,
  getSellerOrders,
};
