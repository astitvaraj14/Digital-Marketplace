const Product = require("../models/Product");
const Category = require("../models/Category");

const checkApprovedSeller = (req, res) => {
  if (!req.user || req.user.role !== "seller") {
    res.status(403).json({
      message: "Only sellers can perform this action",
    });
    return false;
  }

  if (!req.user.isApproved) {
    res.status(403).json({
      message: "Seller account is waiting for admin approval",
    });
    return false;
  }

  return true;
};

// Get all active products
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const filter = {
      $or: [
        { isActive: true },
        { status: "active" },
      ],
    };

    // Search
    if (search) {
      filter.$and = [
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    // Category
    if (category) {
      if (/^[0-9a-fA-F]{24}$/.test(category)) {
        filter.categoryId = category;
      } else {
        filter.category = {
          $regex: `^${category}$`,
          $options: "i",
        };
      }
    }

    // Price
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined && minPrice !== "") {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined && maxPrice !== "") {
        filter.price.$lte = Number(maxPrice);
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

    const products = await Product.find(filter)
      .populate("seller", "name storeName storeDescription")
      .populate("sellerId", "name storeName storeDescription")
      .populate("categoryId", "name description icon")
      .sort(sortOption);

    res.json({
      success: true,
      count: products.length,
      data: products,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name storeName storeDescription")
      .populate("sellerId", "name storeName storeDescription")
      .populate("categoryId", "name description icon");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Get seller's own products
const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      $or: [
        { seller: req.user._id },
        { sellerId: req.user._id },
      ],
    })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// Create product
const createProduct = async (req, res, next) => {
  try {
    if (!checkApprovedSeller(req, res)) return;

    const {
      category,
      categoryId,
      name,
      description,
      price,
      image,
      stock,
      status,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      (category === undefined && categoryId === undefined)
    ) {
      return res.status(400).json({
        message: "Category, name and price are required",
      });
    }

    const product = await Product.create({
      seller: req.user._id,
      sellerId: req.user._id,
      category: category || "",
      categoryId: categoryId || undefined,
      name,
      description: description || "",
      price: Number(price),
      image:
        image ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
      stock: stock !== undefined ? Number(stock) : 0,
      status: status || "active",
      isActive: status !== "inactive",
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    if (!req.user || !["seller", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const sellerId = product.seller || product.sellerId;

    if (
      req.user.role !== "admin" &&
      sellerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can update only your own products",
      });
    }

    const {
      category,
      categoryId,
      name,
      description,
      price,
      image,
      stock,
      status,
      isActive,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (categoryId !== undefined) product.categoryId = categoryId;
    if (price !== undefined) product.price = Number(price);
    if (image !== undefined) product.image = image;
    if (stock !== undefined) product.stock = Number(stock);

    if (status !== undefined) {
      product.status = status;
      product.isActive = status === "active";
    }

    if (isActive !== undefined) {
      product.isActive = isActive;
      product.status = isActive ? "active" : "inactive";
    }

    if (product.price < 0 || product.stock < 0) {
      return res.status(400).json({
        message: "Price and stock cannot be negative",
      });
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const sellerId = product.seller || product.sellerId;

    if (
      req.user.role !== "admin" &&
      sellerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can delete only your own products",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};