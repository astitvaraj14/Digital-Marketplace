const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getOrCreateCart = async (customerId) => {
  let cart = await Cart.findOne({ customerId });
  if (!cart) cart = await Cart.create({ customerId, items: [] });
  return cart;
};

const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const populated = await cart.populate("items.productId");
  res.json({ success: true, message: "OK", data: populated });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || product.status !== "active") {
    res.status(404);
    throw new Error("Product not available");
  }
  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} units in stock`);
  }

  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find((i) => String(i.productId) === String(productId));
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({ productId, quantity });
  }
  await cart.save();
  const populated = await cart.populate("items.productId");
  res.status(201).json({ success: true, message: "Added to cart", data: populated });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((i) => String(i.productId) === String(req.params.productId));
  if (!item) {
    res.status(404);
    throw new Error("Item not in cart");
  }
  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => String(i.productId) !== String(req.params.productId));
  } else {
    item.quantity = quantity;
  }
  await cart.save();
  const populated = await cart.populate("items.productId");
  res.json({ success: true, message: "Cart updated", data: populated });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((i) => String(i.productId) !== String(req.params.productId));
  await cart.save();
  const populated = await cart.populate("items.productId");
  res.json({ success: true, message: "Item removed", data: populated });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
