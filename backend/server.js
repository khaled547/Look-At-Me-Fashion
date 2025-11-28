// backend/server.js

// MongoDB Connect
require("dotenv").config();
const connectDB = require("./config/db");
connectDB();

const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes"); // <-- new

const app = express();

app.use(cors());
app.use(express.json()); // body থেকে JSON পড়তে লাগবে

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Products Route
app.use("/api/products", productRoutes); // <-- new

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
