const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey_digital_marketplace_2026");
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }
    if (user.isBlocked) {
      res.status(403);
      throw new Error("Your account has been blocked. Contact admin.");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error(error.message || "Not authorized, token invalid or expired");
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role '${req.user?.role || "guest"}' is not permitted`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
