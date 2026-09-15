const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    image: {
      type: String,
      default: ""
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({
  name: "text",
  description: "text"
});

module.exports = mongoose.model("Product", productSchema);
