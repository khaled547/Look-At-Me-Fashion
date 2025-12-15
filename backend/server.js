// backend/server.js
//----------------------------------------------------
// 🟡  Load Environment Variables
//----------------------------------------------------
require("dotenv").config();

//----------------------------------------------------
// 🟡  Core Dependencies
//----------------------------------------------------
const express = require("express");
const cors = require("cors");
const path = require("path");

//----------------------------------------------------
// 🟡  Database Connection
//----------------------------------------------------
const connectDB = require("./config/db");
connectDB(); // MongoDB connect

//----------------------------------------------------
// 🟡  Initialize App
//----------------------------------------------------
const app = express();

//----------------------------------------------------
// 🟡  Middlewares
//----------------------------------------------------

// Allow JSON body (limit added for safety)
app.use(express.json({ limit: "2mb" }));

// CORS (Frontend URL allow করার জন্য)
app.use(
  cors({
    origin: "*", // চাইলে এখানে আপনার domain দিতে পারবেন
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

//----------------------------------------------------
// 🟡  ROUTES IMPORT
//----------------------------------------------------
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

//----------------------------------------------------
// 🟡  API ROUTES USE
//----------------------------------------------------
app.get("/", (req, res) => {
  res.send("✅ Look At Me Fashion Backend is running successfully!");
});

// User Routes
app.use("/api/users", userRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

// Product Routes
app.use("/api/products", productRoutes);

// Order Routes
app.use("/api/orders", orderRoutes);

//----------------------------------------------------
// 🟡  404 NOT FOUND HANDLER
//----------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found!",
  });
});

//----------------------------------------------------
// 🟡  GLOBAL ERROR HANDLER (Professional)
//----------------------------------------------------
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

//----------------------------------------------------
// 🟡  START SERVER
//----------------------------------------------------
const PORT = process.env.PORT || 4000;

// Environment validation (optional but helpful)
if (!process.env.MONGO_URL) {
  console.warn("⚠️ WARNING: MONGO_URL is missing in .env file!");
}
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is missing in .env file!");
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
