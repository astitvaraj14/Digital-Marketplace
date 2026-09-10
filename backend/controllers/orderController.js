const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Create new order & reduce stock
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, items: directItems } = req.body;

  let orderItems = [];

  if (directItems && directItems.length > 0) {
    orderItems = directItems;
  } else {
    // Get from customer's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error("Your cart is empty");
    }

    orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
  }

  if (orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  // 1. Inventory Validation
  let totalAmount = 0;
  const processedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.productId._id || item.productId);

    if (!product) {
      res.status(404);
      throw new Error("Product in order not found");
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const itemPrice = product.price;
    totalAmount += itemPrice * item.quantity;

    processedItems.push({
      productId: product._id,
      name: product.name,
      price: itemPrice,
      image: product.image,
      quantity: item.quantity,
    });
  }

  // 2. Create Order
  const order = await Order.create({
    userId: req.user._id,
    items: processedItems,
    totalAmount,
    shippingAddress: shippingAddress || req.user.address || "123 Customer St, City",
    status: "pending",
  });

  // 3. Reduce stock after a successful order (PDF Section 8.3)
  for (const item of processedItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  // 4. Clear Cart
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
});

// @desc    Get logged in customer's orders
// @route   GET /api/orders/mine
// @access  Private (Customer)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("userId", "name email phone");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (
    order.userId._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "seller"
  ) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json({
    success: true,
    data: order,
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin / Seller)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status || order.status;
  await order.save();

  res.json({
    success: true,
    message: "Order status updated",
    data: order,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
