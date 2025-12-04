// backend/routes/adminRoutes.js

//----------------------------------------------------
// 🟡 Dependencies
//----------------------------------------------------
const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAdminSummary } = require("../controllers/adminController");

//----------------------------------------------------
// 🟡 ADMIN DASHBOARD SUMMARY
//  • Total Users
//  • Total Products
//  • Total Orders
//  • Total Sales Amount
//----------------------------------------------------
router.get("/summary", protect, adminOnly, getAdminSummary);

//----------------------------------------------------
// 🟡 FUTURE ADMIN ROUTES (Will expand here)
//----------------------------------------------------
// router.get("/users", protect, adminOnly, getAllUsers);
// router.get("/orders", protect, adminOnly, getAllOrders);
// router.post("/product", protect, adminOnly, createProduct);
// router.delete("/product/:id", protect, adminOnly, deleteProduct);

module.exports = router;

