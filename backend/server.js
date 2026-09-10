const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Models & Seed helper
const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:5174", "http://127.0.0.1:5174"],
  credentials: true,
}));

app.use(express.json());

// Initial Seed Data helper for local testing
const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding initial demo data...");

      // 1. Create Users
      const admin = await User.create({
        name: "Admin User",
        email: "admin@marketplace.com",
        password: "password123",
        role: "admin",
        isApproved: true,
      });

      const seller = await User.create({
        name: "Tech Hub Store",
        email: "seller@marketplace.com",
        password: "password123",
        role: "seller",
        storeName: "Tech Hub Electronics",
        storeDescription: "Premium gadgets, laptops, and accessories.",
        isApproved: true,
      });

      const customer = await User.create({
        name: "Indushree Customer",
        email: "customer@marketplace.com",
        password: "password123",
        role: "customer",
        address: "45 Market Street, Bengaluru",
        phone: "+91 9876543210",
      });

      // 2. Create Categories
      const electronicsCat = await Category.create({
        name: "Electronics",
        description: "Gadgets, devices, smart tech",
        icon: "laptop",
      });

      const fashionCat = await Category.create({
        name: "Fashion & Wearables",
        description: "Apparel, watches, and gear",
        icon: "shirt",
      });

      const homeCat = await Category.create({
        name: "Home & Life",
        description: "Home appliances and lifestyle products",
        icon: "home",
      });

      // 3. Create Sample Products
      await Product.create([
        {
          sellerId: seller._id,
          categoryId: electronicsCat._id,
          name: "Wireless Noise-Canceling Headphones",
          description: "Immersive audio with active noise cancellation and 30-hour battery life.",
          price: 4999,
          stock: 15,
          rating: 4.8,
          status: "active",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
        },
        {
          sellerId: seller._id,
          categoryId: electronicsCat._id,
          name: "Ultra HD Smart Watch Series V",
          description: "AMOLED screen with heart rate monitor, GPS, and water resistance.",
          price: 2999,
          stock: 25,
          rating: 4.6,
          status: "active",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
        },
        {
          sellerId: seller._id,
          categoryId: fashionCat._id,
          name: "Ergonomic Mechanical Keyboard",
          description: "RGB backlit tactile switches for pro typing and gaming performance.",
          price: 3499,
          stock: 8,
          rating: 4.9,
          status: "active",
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop",
        },
        {
          sellerId: seller._id,
          categoryId: homeCat._id,
          name: "Smart Ambient Desk Lamp",
          description: "Adjustable color temperature, wireless charging base, and touch controls.",
          price: 1899,
          stock: 12,
          rating: 4.5,
          status: "active",
          image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop",
        },
        {
          sellerId: seller._id,
          categoryId: electronicsCat._id,
          name: "Portable Bluetooth Speaker Max",
          description: "360-degree sound projection, IPX7 waterproof, deep bass punch.",
          price: 2499,
          stock: 20,
          rating: 4.7,
          status: "active",
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop",
        },
      ]);

      console.log("Initial seed data created successfully!");
    }
  } catch (err) {
    console.error("Error seeding initial data:", err.message);
  }
};

setTimeout(seedInitialData, 1500);

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/seller", require("./routes/sellerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Digital Marketplace Backend API is running on port 5001" });
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
});
