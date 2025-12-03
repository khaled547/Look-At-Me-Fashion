const User = require("../models/users");
const Product = require("../models/product");
const Order = require("../models/order");

exports.getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales: totalSales[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading dashboard" });
  }
};
