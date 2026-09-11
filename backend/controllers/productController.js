const Product = require("../models/Product");

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

const createProduct = async (req, res, next) => {
  try {
    if (!checkApprovedSeller(req, res)) return;

    const {
      name,
      description,
      category,
      price,
      stock,
      image = "",
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "Required product fields are missing",
      });
    }

    const product = await Product.create({
      seller: req.user._id,
      name,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      image,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name storeName storeDescription"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (!checkApprovedSeller(req, res)) return;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can update only your own products",
      });
    }

    const fields = [
      "name",
      "description",
      "category",
      "image",
      "isActive",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.price !== undefined) {
      product.price = Number(req.body.price);
    }

    if (req.body.stock !== undefined) {
      product.stock = Number(req.body.stock);
    }

    if (product.price < 0 || product.stock < 0) {
      return res.status(400).json({
        message: "Price and stock cannot be negative",
      });
    }

    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (!checkApprovedSeller(req, res)) return;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can delete only your own products",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getSellerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};