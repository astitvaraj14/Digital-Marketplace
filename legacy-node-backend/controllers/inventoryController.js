const Product = require("../models/Product");
const InventoryTransaction = require("../models/InventoryTransaction");


const getInventory = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({
      stock: 1,
    });
    res.json({ count: products.length, products });
  } catch (error) {
    next(error);
  }
};


const getLowStockProducts = async (req, res, next) => {
  try {
    const threshold = Math.max(Number(req.query.threshold) || 5, 0);
    const products = await Product.find({
      seller: req.user._id,
      stock: { $lte: threshold },
    }).sort({ stock: 1 });
    res.json({ threshold, count: products.length, products });
  } catch (error) {
    next(error);
  }
};


const adjustStock = async (req, res, next) => {
  try {
    const { quantity, type = "restock", note = "" } = req.body;
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive integer" });
    }
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    const previousStock = product.stock;
    const newStock = type === "restock" ? previousStock + qty : qty;
    product.stock = newStock;
    await product.save();
    const transaction = await InventoryTransaction.create({
      product: product._id,
      seller: req.user._id,
      type,
      quantity: qty,
      previousStock,
      newStock,
      note,
    });
    res.json({ message: "Stock updated successfully", product, transaction });
  } catch (error) {
    next(error);
  }
};

const getInventoryHistory = async (req, res, next) => {
  try {
    const history = await InventoryTransaction.find({ seller: req.user._id })
      .populate("product", "name")
      .sort({ createdAt: -1 });
    res.json({ count: history.length, history });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getInventory,
  getLowStockProducts,
  adjustStock,
  getInventoryHistory,
};
