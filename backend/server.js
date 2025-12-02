// backend/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Database Connect
const connectDB = require("./config/db");
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --------------------------------------
// ROUTES IMPORT
// --------------------------------------
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");   // ⭐ NEW

// --------------------------------------
// ROUTES USE
// --------------------------------------
app.get("/", (req, res) => {
  res.send("Look At Me Fashion Backend is running!");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);   // ⭐ NEW

// --------------------------------------
// GLOBAL ERROR HANDLER (Optional Premium)
// --------------------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Server Error Occurred" });
});

// --------------------------------------
// START SERVER
// --------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
