const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

// @route POST /api/orders  (customer checkout - mock payment)
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress) {
    res.status(400);
    throw new Error("Shipping address is required");
  }

  const cart = await Cart.findOne({ customerId: req.user._id }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = item.productId;
    if (!product || product.status !== "active") {
      res.status(400);
      throw new Error(`Product no longer available: ${product ? product.name : "unknown"}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
    }
    orderItems.push({
      productId: product._id,
      sellerId: product.sellerId,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      itemStatus: "Placed",
    });
    totalAmount += product.price * item.quantity;
  }

  // Reduce stock for each product (mini-project scale, sequential is fine)
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
  }

  const order = await Order.create({
    customerId: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentStatus: "mock_paid",
    orderStatus: "Placed",
  });

  cart.items = [];
  await cart.save();

  // Notifications: customer + each distinct seller
  const notifs = [
    { userId: req.user._id, message: `Order #${order._id} placed successfully.`, type: "order_placed" },
  ];
  const sellerIds = [...new Set(orderItems.map((i) => String(i.sellerId)))];
  sellerIds.forEach((sellerId) => {
    notifs.push({
      userId: sellerId,
      message: `New order received (Order #${order._id}).`,
      type: "new_order",
    });
  });
  await Notification.insertMany(notifs);

  res.status(201).json({ success: true, message: "Order placed", data: order });
});

// @route GET /api/orders/my (customer)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customerId: req.user._id }).sort("-createdAt");
  res.json({ success: true, message: "OK", data: orders });
});

// @route GET /api/orders/seller (seller - orders containing their items)
const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ "items.sellerId": req.user._id })
    .populate("customerId", "name email")
    .sort("-createdAt");

  // Only expose this seller's line items to keep response scoped
  const scoped = orders.map((o) => ({
    _id: o._id,
    customer: o.customerId,
    shippingAddress: o.shippingAddress,
    createdAt: o.createdAt,
    items: o.items.filter((i) => String(i.sellerId) === String(req.user._id)),
  }));

  res.json({ success: true, message: "OK", data: scoped });
});

// @route PUT /api/orders/:orderId/item/:productId/status (seller updates their item)
const updateItemStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const order = await Order.findById(req.params.orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const item = order.items.find(
    (i) => String(i.productId) === String(req.params.productId) && String(i.sellerId) === String(req.user._id)
  );
  if (!item) {
    res.status(403);
    throw new Error("Not authorized to update this item, or item not found in order");
  }
  item.itemStatus = status;

  // Derive overall order status: if every item shares the same status, mirror it;
  // otherwise fall back to the least-advanced status among items.
  const order_priority = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
  const statuses = order.items.map((i) => i.itemStatus);
  const allSame = statuses.every((s) => s === statuses[0]);
  order.orderStatus = allSame
    ? statuses[0]
    : order_priority[Math.min(...statuses.map((s) => order_priority.indexOf(s)))];

  await order.save();

  await Notification.create({
    userId: order.customerId,
    message: `Item "${item.name}" in your order #${order._id} is now ${status}.`,
    type: "order_update",
  });

  res.json({ success: true, message: "Item status updated", data: order });
});

// @route GET /api/orders (admin - all orders)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("customerId", "name email").sort("-createdAt");
  res.json({ success: true, message: "OK", data: orders });
});

module.exports = { placeOrder, getMyOrders, getSellerOrders, updateItemStatus, getAllOrders };
