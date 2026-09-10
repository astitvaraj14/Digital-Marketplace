const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "customer" });
  const totalSellers = await User.countDocuments({ role: "seller" });
  const pendingSellers = await User.countDocuments({ role: "seller", isApproved: false });
  const totalProducts = await Product.countDocuments({});
  const totalOrders = await Order.countDocuments({});

  const orders = await Order.find({});
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalSellers,
      pendingSellers,
      totalProducts,
      totalOrders,
      totalRevenue,
    },
  });
});

// @desc    Get all users or filter by role
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = {};
  if (role) filter.role = role;

  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

  res.json({
    success: true,
    data: users,
  });
});

// @desc    Toggle block/unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin)
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot block admin user");
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    data: user.toSafeObject(),
  });
});

// @desc    Toggle seller approval status (PDF 10.2)
// @route   PUT /api/admin/sellers/:id/approve
// @access  Private (Admin)
const toggleApproveSeller = asyncHandler(async (req, res) => {
  const seller = await User.findOne({
    _id: req.params.id,
    role: "seller",
  });

  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }

  seller.isApproved = !seller.isApproved;
  await seller.save();

  res.json({
    success: true,
    message: `Seller ${seller.isApproved ? "approved" : "unapproved"}`,
    data: seller.toSafeObject(),
  });
});

// @desc    Get all products for admin review
// @route   GET /api/admin/products
// @access  Private (Admin)
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("categoryId", "name")
    .populate("sellerId", "name storeName email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: products,
  });
});

module.exports = {
  getAdminDashboard,
  getUsers,
  toggleBlockUser,
  toggleApproveSeller,
  getAllProducts,
};
