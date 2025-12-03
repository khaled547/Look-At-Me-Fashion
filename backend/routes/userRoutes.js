// backend/routes/userRoutes.js
const express = require("express");
const { body } = require("express-validator");

const {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  adminLogin,   // ⭐ Admin Login Controller
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ==============================
 * USER REGISTRATION
 * ==============================
 */
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

/**
 * ==============================
 * NORMAL USER LOGIN
 * ==============================
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

/**
 * ==============================
 * ADMIN LOGIN  ⭐ NEW
 * ==============================
 */
router.post(
  "/admin-login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  adminLogin
);

/**
 * ==============================
 * GET LOGGED-IN USER PROFILE
 * ==============================
 */
router.get("/me", protect, getMe);

/**
 * ==============================
 * UPDATE PROFILE
 * ==============================
 */
router.put("/me", protect, updateMe);

/**
 * ==============================
 * FUTURE ADMIN ROUTES
 * ==============================
 */
// router.get("/all", protect, adminOnly, getAllUsers);
// router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
