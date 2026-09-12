const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const errorHandler = require("./middleware/errorHandler");

dotenv.config();

connectDB();

const app = express();


// CORS CONFIGURATION
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5174"
  })
);


// BODY PARSER
app.use(express.json());


// ROOT ROUTE
app.get("/", (req, res) => {
  res.json({
    message: "Digital Marketplace API is running"
  });
});


// AUTHENTICATION ROUTES
app.use("/api/auth", authRoutes);


// USER PROFILE & ACCOUNT ROUTES
app.use("/api/users", userRoutes);


// ADMIN ROUTES
app.use("/api/admin", adminRoutes);


// GLOBAL ERROR HANDLER
app.use(errorHandler);


// SERVER
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});