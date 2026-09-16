const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0 || !shippingAddress?.trim())
      return res.status(400).json({ message: "Items and shipping address are required" });

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!item.product || !Number.isInteger(quantity) || quantity < 1)
        return res.status(400).json({ message: "Each item needs a valid product and quantity" });

      const product = await Product.findOne({
        _id: item.product,
        $or: [{ isActive: true }, { status: "active" }, { status: { $exists: false } }],
      });
      if (!product) return res.status(404).json({ message: "Product not found" });

      if (product.stock < quantity)
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      product.stock -= quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        seller: product.seller || product.sellerId || req.user._id,
        name: product.name,
        price: product.price,
        quantity,
      });

      totalAmount += product.price * quantity;
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress.trim(),
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (e) {
    next(e);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });
    res.json({ count: orders.length, orders });
  } catch (e) {
    next(e);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    }).populate("items.product", "name image");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (e) {
    next(e);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };

