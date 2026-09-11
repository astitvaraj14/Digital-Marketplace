const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Order items are required" });
    if (!shippingAddress)
      return res.status(400).json({ message: "Shipping address is required" });

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0)
        return res.status(400).json({ message: "Invalid quantity" });

      if (product.stock < quantity)
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      orderItems.push({
        product: product._id,
        seller: product.seller || product.sellerId || req.user._id,
        name: product.name,
        price: product.price,
        quantity
      });

      totalAmount += product.price * quantity;
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });

    res.json({ count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id
    }).populate("items.product", "name image");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };
