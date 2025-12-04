// backend/controllers/productController.js

const Product = require("../models/product");

//--------------------------------------------------
// 🟡 Get All Products
//--------------------------------------------------
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Product Fetch Error:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

//--------------------------------------------------
// 🟡 Get Single Product
//--------------------------------------------------
exports.getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });

    res.json(p);
  } catch (err) {
    console.error("Product Details Error:", err);
    res.status(500).json({ message: "Error fetching product" });
  }
};

//--------------------------------------------------
// 🟡 Get Products by Category
//--------------------------------------------------
exports.getProductsByCategory = async (req, res) => {
  try {
    const list = await Product.find({ category: req.params.cat });
    res.json(list);
  } catch (err) {
    console.error("Category Fetch Error:", err);
    res.status(500).json({ message: "Error fetching category products" });
  }
};

//--------------------------------------------------
// 🟡 Admin: Create Product
//--------------------------------------------------
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, image, description, stock } = req.body;

    if (!name || !price || !category)
      return res.status(400).json({ message: "Missing required fields" });

    const newProduct = await Product.create({
      name,
      price,
      category,
      image,
      description,
      stock,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Product Create Error:", err);
    res.status(500).json({ message: "Error creating product" });
  }
};

//--------------------------------------------------
// 🟡 Admin: Update Product
//--------------------------------------------------
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Product not found" });

    res.json(updated);
  } catch (err) {
    console.error("Product Update Error:", err);
    res.status(500).json({ message: "Error updating product" });
  }
};

//--------------------------------------------------
// 🟡 Admin: Delete Product
//--------------------------------------------------
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Product Delete Error:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
};
