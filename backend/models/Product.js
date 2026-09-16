const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Existing integration field
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Indushree/customer marketplace compatibility
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Existing integration category field
    category: {
      type: String,
      trim: true,
      default: "",
    },

    // Indushree/customer marketplace category
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Keep seller and sellerId synchronized.
 * This allows both the existing integration code
 * and Indushree's customer marketplace code to work.
 */
productSchema.pre("save", function (next) {
  if (!this.seller && this.sellerId) {
    this.seller = this.sellerId;
  }

  if (!this.sellerId && this.seller) {
    this.sellerId = this.seller;
  }

  next();
});

productSchema.index({
  name: "text",
  description: "text",
});

module.exports = mongoose.model("Product", productSchema);