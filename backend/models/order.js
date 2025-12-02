const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    phone: String,
    address: String,
    items: [
      {
        id: String,
        name: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

