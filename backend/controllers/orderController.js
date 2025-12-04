// backend/controllers/orderController.js

const Order = require("../models/order");

//--------------------------------------------------
// 🟡 Create Order (User Checkout)
//--------------------------------------------------
exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Order Create Error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

//--------------------------------------------------
// 🟡 Get Orders of Logged-in User
//--------------------------------------------------
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    console.error("User Orders Error:", err);
    res.status(500).json({ message: "Error fetching user orders" });
  }
};

//--------------------------------------------------
// 🟡 Admin: Get All Orders
//--------------------------------------------------
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Admin Orders Error:", err);
    res.status(500).json({ message: "Error loading all orders" });
  }
};

//--------------------------------------------------
// 🟡 Admin: Update Order Status
//--------------------------------------------------
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ message: "Error updating order status" });
  }
};

//--------------------------------------------------
// 🟡 Payment Confirmation (Used in payment.html)
//--------------------------------------------------
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, transactionId } = req.body;

    const order = await Order.findById(orderId);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.paymentMethod = paymentMethod;
    order.transactionId = transactionId || null;
    order.status = paymentMethod === "cod" ? "confirmed" : "paid";

    await order.save();

    res.json({
      success: true,
      message: "Payment confirmed successfully!",
      order,
    });
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ message: "Payment process failed" });
  }
};
