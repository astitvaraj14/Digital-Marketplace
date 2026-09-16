const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private (Customer)
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate({
    path: "items.productId",
    populate: { path: "categoryId", select: "name" },
  });

  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }

  // Filter out any items where productId is deleted or inactive
  const validItems = cart.items.filter((item) => item.productId !== null);
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  res.json({
    success: true,
    data: cart,
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private (Customer)
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  const qty = Number(quantity) || 1;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < qty) {
    res.status(400);
    throw new Error(`Insufficient stock for ${product.name}. Available stock: ${product.stock}`);
  }

  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    cart = new Cart({
      userId: req.user._id,
      items: [{ productId, quantity: qty }],
    });
  } else {
    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + qty;
      if (product.stock < newQty) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}. Stock limit reached.`);
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }
  }

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate("items.productId");

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    data: updatedCart,
  });
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/item/:productId
// @access  Private (Customer)
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const qty = Number(quantity);
  if (qty <= 0) {
    return removeFromCart(req, res);
  }

  const product = await Product.findById(productId);
  if (product && product.stock < qty) {
    res.status(400);
    throw new Error(`Insufficient stock for ${product.name}. Maximum available: ${product.stock}`);
  }

  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = qty;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.json({
      success: true,
      message: "Cart updated",
      data: updatedCart,
    });
  } else {
    res.status(404);
    throw new Error("Item not in cart");
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
// @access  Private (Customer)
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate("items.productId");

  res.json({
    success: true,
    message: "Item removed from cart",
    data: updatedCart,
  });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private (Customer)
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });

  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.json({
    success: true,
    message: "Cart cleared",
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
