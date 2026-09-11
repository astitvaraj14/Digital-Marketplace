const User = require("../models/User");
const Product = require("../models/Product");

const getSellerProfile = async (req, res, next) => {
  try {
    const seller = await User.findById(req.user._id).select("-password");

    if (!seller)
      return res.status(404).json({ message: "Seller not found" });

    res.json({ seller });
  } catch (error) {
    next(error);
  }
};

const updateSellerProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      address,
      storeName,
      storeDescription,
    } = req.body;

    const seller = await User.findById(req.user._id);

    if (!seller)
      return res.status(404).json({ message: "Seller not found" });

    if (name !== undefined) seller.name = name;
    if (phone !== undefined) seller.phone = phone;
    if (address !== undefined) seller.address = address;
    if (storeName !== undefined) seller.storeName = storeName;
    if (storeDescription !== undefined)
      seller.storeDescription = storeDescription;

    await seller.save();

    res.json({
      message: "Seller profile updated successfully",
      seller: seller.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

const getSellerDashboard = async (req, res, next) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    });

    const totalProducts = products.length;

    const activeProducts = products.filter(
      (p) => p.isActive
    ).length;

    const totalStock = products.reduce(
      (sum, p) => sum + p.stock,
      0
    );

    res.json({
      seller: req.user.toSafeObject(),
      statistics: {
        totalProducts,
        activeProducts,
        totalStock,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSellerProfile,
  updateSellerProfile,
  getSellerDashboard,
};