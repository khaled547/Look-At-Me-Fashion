// backend/models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // 🔹 Product Name
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    // 🔹 Price
    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    // 🔹 Category (Men, Women, Kids, Shoes etc.)
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    // 🔹 Single Image URL (Future: multiple images optional)
    image: {
      type: String,
      default: null,
    },

    // 🔹 Product Description
    description: {
      type: String,
      default: "",
    },

    // 🔹 Stock (very important for real e-commerce)
    stock: {
      type: Number,
      default: 10, // Future: admin panel will update
    },

    // 🔹 Discount Price (optional)
    discountPrice: {
      type: Number,
      default: null,
    },

    // 🔹 Product Status (Available / Out of Stock)
    status: {
      type: String,
      enum: ["available", "out_of_stock"],
      default: "available",
    },
  },
  {
    timestamps: true, // Auto createdAt / updatedAt
  }
);

module.exports = mongoose.model("Product", productSchema);
