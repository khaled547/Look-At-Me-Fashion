// backend/controllers/userController.js

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

// ===============================
// JWT Generator
// ===============================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ===============================
// REGISTER USER
// ===============================
exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Email required na korle:
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "User already exists with this email" });

    const user = await User.create({ name, email, password });

    const token = generateToken(user);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// NORMAL USER LOGIN
// ===============================
exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// ADMIN LOGIN
// ===============================
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email }).select("+password");

    if (!admin)
      return res.status(400).json({ message: "Admin not found!" });

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Not an admin account" });
    }

    const match = await admin.matchPassword(password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password!" });

    const token = generateToken(admin);

    return res.json({
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GET LOGGED-IN USER PROFILE
// ===============================
exports.getMe = async (req, res, next) => {
  try {
    return res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || "N/A",
      role: req.user.role,
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
exports.updateMe = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (password) user.password = password; // hashing auto হবে

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
