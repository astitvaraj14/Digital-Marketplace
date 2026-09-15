const User = require("../models/User");


// GET CURRENT USER PROFILE
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user
    });
  } catch (error) {
    next(error);
  }
};


// UPDATE CURRENT USER PROFILE
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const {
      name,
      phone,
      address
    } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty"
        });
      }

      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (address !== undefined) {
      user.address = address.trim();
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};


// CHANGE PASSWORD
const changePassword = async (req, res, next) => {
  try {
    const {
      currentPassword,
      newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must contain at least 6 characters"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const passwordMatch =
      await user.matchPassword(currentPassword);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    user.password = newPassword;

    await user.save();

    res.json({
      message: "Password changed successfully"
    });
  } catch (error) {
    next(error);
  }
};


// GET CURRENT ACCOUNT STATUS
const getAccountStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select(
        "name email role isBlocked isApproved storeName"
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    let status = "active";

    if (user.isBlocked) {
      status = "blocked";
    } else if (
      user.role === "seller" &&
      !user.isApproved
    ) {
      status = "pending_approval";
    }

    res.json({
      status,
      user
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAccountStatus
};