const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer"
    },

    phone: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    storeName: {
      type: String,
      default: ""
    },

    storeDescription: {
      type: String,
      default: ""
    },

    isApproved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
      return;
    }
  
    const salt = await bcrypt.genSalt(10);
  
    this.password = await bcrypt.hash(
      this.password,
      salt
    );
  });

  userSchema.methods.matchPassword = function (
    enteredPassword
  ) {
    return bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

  userSchema.methods.toSafeObject = function () {
    return {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      phone: this.phone,
      address: this.address,
      isBlocked: this.isBlocked,
      storeName: this.storeName,
      storeDescription: this.storeDescription,
      isApproved: this.isApproved
    };
  };

module.exports = mongoose.model("User", userSchema);