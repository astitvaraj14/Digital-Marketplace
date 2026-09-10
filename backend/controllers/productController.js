const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Category = require("../models/Category");

// @desc    Get all active products with search, category, price, sorting filters
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, sort } = req.query;

  let query = { status: "active" };

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Category filter
  if (category) {
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      query.categoryId = category;
    } else {
      const catObj = await Category.findOne({ name: { $regex: `^${category}$`, $options: "i" } });
      if (catObj) {
        query.categoryId = catObj._id;
      }
    }
  }

  // Price filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined && minPrice !== "") {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== "") {
      query.price.$lte = Number(maxPrice);
    }
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === "price-asc") {
    sortOption = { price: 1 };
  } else if (sort === "price-desc") {
    sortOption = { price: -1 };
  } else if (sort === "rating") {
    sortOption = { rating: -1 };
  } else if (sort === "newest") {
    sortOption = { createdAt: -1 };
  }

  const products = await Product.find(query)
    .populate("categoryId", "name icon")
    .populate("sellerId", "name storeName storeDescription")
    .sort(sortOption);

  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Get product details by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("categoryId", "name description icon")
    .populate("sellerId", "name storeName storeDescription rating");

  if (product) {
    res.json({
      success: true,
      data: product,
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get seller's products
// @route   GET /api/products/seller/mine
// @access  Private (Seller only)
const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ sellerId: req.user._id })
    .populate("categoryId", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: products,
  });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Seller only)
const createProduct = asyncHandler(async (req, res) => {
  if (!req.user.isApproved) {
    res.status(403);
    throw new Error("Your seller account is not yet approved by admin");
  }

  const { categoryId, name, description, price, image, stock, status } = req.body;

  if (!categoryId || !name || price === undefined) {
    res.status(400);
    throw new Error("Category, name and price are required");
  }

  const product = await Product.create({
    sellerId: req.user._id,
    categoryId,
    name,
    description: description || "",
    price: Number(price),
    image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
    stock: stock !== undefined ? Number(stock) : 10,
    status: status || "active",
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Seller only)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this product");
  }

  const { categoryId, name, description, price, image, stock, status } = req.body;

  product.name = name || product.name;
  product.description = description !== undefined ? description : product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.image = image || product.image;
  product.stock = stock !== undefined ? Number(stock) : product.stock;
  product.status = status || product.status;
  if (categoryId) product.categoryId = categoryId;

  const updatedProduct = await product.save();

  res.json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this product");
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product removed successfully",
  });
});

module.exports = {
  getProducts,
  getProductById,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
