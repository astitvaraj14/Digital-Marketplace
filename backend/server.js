require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");

const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

connectDB();

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173"
  })
);

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Digital Marketplace API is running"
  });
});

// Authentication
app.use("/api/auth", authRoutes);

// User profile and account
app.use("/api/users", userRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Seller
app.use("/api/sellers", sellerRoutes);

// Products
app.use("/api/products", productRoutes);

// Categories
app.use("/api/categories", categoryRoutes);

// Cart
app.use("/api/cart", cartRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// Inventory
app.use("/api/inventory", inventoryRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
