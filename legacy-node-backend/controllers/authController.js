const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = "customer",
      phone = "",
      address = "",
      storeName = "",
      storeDescription = ""
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (!["customer", "seller"].includes(role)) {
      return res.status(400).json({
        message: "Only customer or seller registration is allowed"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      phone,
      address,
      storeName: role === "seller" ? storeName : "",
      storeDescription: role === "seller" ? storeDescription : "",
      isApproved: role === "customer"
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message:
        role === "seller"
          ? "Seller registered successfully. Waiting for admin approval."
          : "Customer registered successfully.",
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required"
        });
      }
  
      const user = await User.findOne({
        email: email.toLowerCase()
      });
  
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }
  
      if (user.isBlocked) {
        return res.status(403).json({
          message: "Account is blocked"
        });
      }
  
      const passwordMatch =
        await user.matchPassword(password);
  
      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }
  
      const token = generateToken(user._id);
  
      res.json({
        message: "Login successful",
        token,
        user: user.toSafeObject()
      });
    } catch (error) {
      next(error);
    }
  };

const getMe = async (req, res) => {
  res.json({
    user: req.user.toSafeObject()
  });
};

module.exports = {
  register,
  login,
  getMe
};