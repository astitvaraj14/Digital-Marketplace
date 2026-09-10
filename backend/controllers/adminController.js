const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");

// @route GET /api/admin/dashboard
const getAdminDashboard = asyncHandler(async (req, res) => {
  const [totalCustomers, totalSellers, pendingSellerApprovals, totalProducts, totalCategories, orders] =
    await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "seller" }),
      User.countDocuments({ role: "seller", isApproved: false }),
      Product.countDocuments(),
      Category.countDocuments(),
      Order.find(),
    ]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  res.json({
    success: true,
    message: "OK",
    data: {
      totalCustomers,
      totalSellers,
      pendingSellerApprovals,
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
    },
  });
});

// @route GET /api/admin/users?role=customer|seller
const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).select("-password").sort("-createdAt");
  res.json({ success: true, message: "OK", data: users });
});

// @route PUT /api/admin/users/:id/block
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot block an admin account");
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ success: true, message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, data: user.toSafeObject() });
});

// @route PUT /api/admin/sellers/:id/approve
const toggleApproveSeller = asyncHandler(async (req, res) => {
  const seller = await User.findOne({ _id: req.params.id, role: "seller" });
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

// @route GET /api/admin/products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("categoryId", "name").populate("sellerId", "name storeName");
  res.json({ success: true, message: "OK", data: products });
});

module.exports = { getAdminDashboard, getUsers, toggleBlockUser, toggleApproveSeller, getAllProducts };
