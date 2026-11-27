const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "admin@digitalmarketplace.com"
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const admin = await User.create({
      name: "Marketplace Admin",
      email: "admin@digitalmarketplace.com",
      password: "Admin@123",
      role: "admin",
      isApproved: true
    });

    console.log("Admin created successfully.");
    console.log(`Email: ${admin.email}`);
    console.log("Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error(`Admin seed error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();