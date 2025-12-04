// backend/routes/productRoutes.js

//----------------------------------------------------
// 🟡 Dependencies
//----------------------------------------------------
const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { protect, adminOnly } = require("../middleware/authMiddleware");

//----------------------------------------------------
// 🟡 GET ALL PRODUCTS
//----------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Product Fetch Error:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

//----------------------------------------------------
// 🟡 GET SINGLE PRODUCT BY ID
//----------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("Single Product Error:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
});

//----------------------------------------------------
// 🟡 GET PRODUCTS BY CATEGORY
//----------------------------------------------------
router.get("/category/:cat", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.cat });

    res.json(products);
  } catch (error) {
    console.error("Category Error:", error);
    res.status(500).json({ message: "Error fetching category products" });
  }
});

//----------------------------------------------------
// 🟡 ADMIN: CREATE NEW PRODUCT
//----------------------------------------------------
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = await Product.create({
      name,
      price,
      category,
      image,
      description,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Product Create Error:", error);
    res.status(500).json({ message: "Error creating product" });
  }
});

//----------------------------------------------------
// 🟡 ADMIN: UPDATE PRODUCT
//----------------------------------------------------
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Product not found" });

    res.json(updated);
  } catch (error) {
    console.error("Product Update Error:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

//----------------------------------------------------
// 🟡 ADMIN: DELETE PRODUCT
//----------------------------------------------------
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product Delete Error:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
