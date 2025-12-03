// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/users");

// Logged in user চেক
const protect = async (req, res, next) => {
  let token;

  // আমরা ধরে নিচ্ছি frontend থেকে "Authorization: Bearer TOKEN" পাঠাবে
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // user info req.user এ রাখব
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// শুধুমাত্র admin ইউজারদের জন্য
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access only" });
};

module.exports = { protect, adminOnly };
