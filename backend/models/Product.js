const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "https://placehold.co/400x400?text=Product" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
