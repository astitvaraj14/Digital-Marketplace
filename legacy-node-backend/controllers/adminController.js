const User = require("../models/User");

const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalCustomers = await User.countDocuments({
      role: "customer"
    });

    const totalSellers = await User.countDocuments({
      role: "seller"
    });

    const pendingSellers = await User.countDocuments({
      role: "seller",
      isApproved: false
    });

    const approvedSellers = await User.countDocuments({
      role: "seller",
      isApproved: true
    });

    const blockedUsers = await User.countDocuments({
      isBlocked: true
    });

    res.json({
      statistics: {
        totalUsers,
        totalCustomers,
        totalSellers,
        pendingSellers,
        approvedSellers,
        blockedUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

const getPendingSellers = async (req, res, next) => {
  try {
    const sellers = await User.find({
      role: "seller",
      isApproved: false
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      count: sellers.length,
      sellers
    });
  } catch (error) {
    next(error);
  }
};

const approveSeller = async (req, res, next) => {
  try {
    const seller = await User.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found"
      });
    }

    if (seller.role !== "seller") {
      return res.status(400).json({
        message: "Selected user is not a seller"
      });
    }

    seller.isApproved = true;

    await seller.save();

    res.json({
      message: "Seller approved successfully",
      seller: seller.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

const rejectSeller = async (req, res, next) => {
  try {
    const seller = await User.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found"
      });
    }

    if (seller.role !== "seller") {
      return res.status(400).json({
        message: "Selected user is not a seller"
      });
    }

    await seller.deleteOne();

    res.json({
      message: "Seller registration rejected successfully"
    });
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "Admin cannot block their own account"
      });
    }

    user.isBlocked = true;

    await user.save();

    res.json({
      message: "User blocked successfully",
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.isBlocked = false;

    await user.save();

    res.json({
      message: "User unblocked successfully",
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  getPendingSellers,
  approveSeller,
  rejectSeller,
  blockUser,
  unblockUser
};