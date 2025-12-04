// backend/routes/orderRoutes.js

//----------------------------------------------------
// 🟡 Dependencies
//----------------------------------------------------
const express = require("express");
const router = express.Router();
const Order = require("../models/order");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  confirmPayment,
} = require("../controllers/orderController");

//----------------------------------------------------
// 🟡 CREATE ORDER (User)
//----------------------------------------------------
router.post("/", protect, createOrder);

//----------------------------------------------------
// 🟡 GET ORDERS OF LOGGED-IN USER
//----------------------------------------------------
router.get("/my-orders", protect, getUserOrders);

//----------------------------------------------------
// 🟡 ADMIN: GET ALL ORDERS
//----------------------------------------------------
router.get("/", protect, adminOnly, getAllOrders);

//----------------------------------------------------
// 🟡 ADMIN: UPDATE ORDER STATUS (pending → confirmed → shipped → delivered)
//----------------------------------------------------
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

//----------------------------------------------------
// 🟡 CONFIRM PAYMENT (Used in payment.html)
//----------------------------------------------------
router.post("/payment-confirm", protect, confirmPayment);

module.exports = router;


