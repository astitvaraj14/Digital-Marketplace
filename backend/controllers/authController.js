const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, address, storeName, storeDescription } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const userRole = role || "customer";
  const isApproved = userRole === "seller" ? false : true;

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    phone: phone || "",
    address: address || "",
    storeName: storeName || "",
    storeDescription: storeDescription || "",
    isApproved,
  });

  if (user) {
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: user.toSafeObject(),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.isBlocked) {
      res.status(403);
      throw new Error("Your account has been blocked. Contact admin.");
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: user.toSafeObject(),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      success: true,
      user: user.toSafeObject(),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    if (user.role === "seller") {
      user.storeName = req.body.storeName !== undefined ? req.body.storeName : user.storeName;
      user.storeDescription = req.body.storeDescription !== undefined ? req.body.storeDescription : user.storeDescription;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      token: generateToken(updatedUser._id),
      user: updatedUser.toSafeObject(),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  register,
  login,
  me,
  updateProfile,
};
