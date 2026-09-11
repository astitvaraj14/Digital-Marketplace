require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Day 2
const inventoryRoutes = require("./routes/inventoryRoutes");


connectDB();


const app = express();


app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
  })
);


app.use(express.json());

app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.json({
    success:true,
    message:"Digital Marketplace API is running"
  });
});


// Existing routes

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/sellers", sellerRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/notifications", notificationRoutes);


// Day 2 inventory route

app.use("/api/inventory", inventoryRoutes);



app.use(notFound);

app.use(errorHandler);



const PORT = process.env.PORT || 5001;


app.listen(PORT,()=>{

 console.log(`Server running on http://localhost:${PORT}`);

});