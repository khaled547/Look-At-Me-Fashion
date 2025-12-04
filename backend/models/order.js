// backend/models/order.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 🔹 কোন user অর্ডার করলো (user dashboard এর জন্য)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ভবিষ্যতে চাইলে required করতে পারেন
    },

    // 🔹 Basic Checkout Info
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    // 🔹 Cart Items
    items: [
      {
        id: String,
        name: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],

    // 🔹 Order Amount
    totalAmount: { type: Number, required: true },

    // 🔹 Payment Details
    paymentMethod: {
      type: String,
      enum: ["cod", "bkash", "nagad", "rocket"],
      default: "cod",
    },

    transactionId: {
      type: String,
      default: null,
    },

    // 🔹 Order Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);


