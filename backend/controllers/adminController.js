// backend/controllers/adminController.js

const User = require("../models/users");
const Product = require("../models/product");
const Order = require("../models/order");

exports.getAdminSummary = async (req, res) => {
  try {
    // 🔹 Count users & admins
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // 🔹 Count products
    const totalProducts = await Product.countDocuments();

    // 🔹 Count total orders
    const totalOrders = await Order.countDocuments();

    // 🔹 Order status breakdown
    const pending = await Order.countDocuments({ status: "pending" });
    const confirmed = await Order.countDocuments({ status: "confirmed" });
    const paid = await Order.countDocuments({ status: "paid" });
    const shipped = await Order.countDocuments({ status: "shipped" });
    const delivered = await Order.countDocuments({ status: "delivered" });
    const cancelled = await Order.countDocuments({ status: "cancelled" });

    // 🔹 Total Sales (sum of totalAmount)
    const salesResult = await Order.aggregate([
      { $match: { status: { $in: ["paid", "delivered"] } } }, // Only valid paid orders
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalSales = salesResult[0]?.total || 0;

    //-------------------------------------------
    // RESPONSE
    //-------------------------------------------
    res.json({
      summary: {
        totalUsers,
        totalAdmins,
        totalProducts,
        totalOrders,

        orderStatus: {
          pending,
          confirmed,
          paid,
          shipped,
          delivered,
          cancelled,
        },

        totalSales,
      },
    });
  } catch (err) {
    console.error("Dashboard Load Error:", err);
    res.status(500).json({ message: "Error loading dashboard" });
  }
};
