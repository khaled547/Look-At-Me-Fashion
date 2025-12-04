// backend/middleware/authMiddleware.js

//----------------------------------------------------
// 🟡 Dependencies
//----------------------------------------------------
const jwt = require("jsonwebtoken");
const User = require("../models/users");

//----------------------------------------------------
// 🟡 USER AUTH MIDDLEWARE (Verify JWT Token)
//----------------------------------------------------
const protect = async (req, res, next) => {
  let token;

  try {
    // Token format: "Authorization: Bearer TOKEN"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token found
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized — No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user (excluding password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized — User not found" });
    }

    // Store user info inside request
    req.user = user;

    next();
  } catch (err) {
    console.error("🔥 JWT Error:", err.message);

    let msg = "Unauthorized — Invalid or expired token";

    // Detect token expiration
    if (err.name === "TokenExpiredError") {
      msg = "Session expired — Please login again";
    }

    return res.status(401).json({ message: msg });
  }
};

//----------------------------------------------------
// 🟡 ADMIN ONLY MIDDLEWARE
//----------------------------------------------------
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Access denied — Admins only" });
};

//----------------------------------------------------
module.exports = { protect, adminOnly };

