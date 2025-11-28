// backend/models/Product.js

const mongoose = require("mongoose");

// প্রোডাক্টের জন্য স্কিমা (ডাটার স্ট্রাকচার)
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,      // নাম না থাকলে Error
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,        // ইমেজের URL বা ফাইল নাম
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // ডকুমেন্ট কখন তৈরি/আপডেট হয়েছে সেটা নিজে থেকে রাখবে
  }
);

// এই স্কিমা থেকে Model বানালাম
const Product = mongoose.model("Product", productSchema);

// বাইরে থেকে use করার জন্য export করলাম
module.exports = Product;
