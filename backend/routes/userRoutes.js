// backend/routes/userRoutes.js

//----------------------------------------------------
// 🟡 Dependencies
//----------------------------------------------------
const express = require("express");
const { body } = require("express-validator");

const {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
  updateMe,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

//----------------------------------------------------
// 🟡 USER REGISTRATION
//----------------------------------------------------
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

//----------------------------------------------------
// 🟡 NORMAL USER LOGIN
//----------------------------------------------------
router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

//----------------------------------------------------
// 🟡 ADMIN LOGIN
//----------------------------------------------------
router.post(
  "/admin-login",
  [
    body("email").trim().isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  adminLogin
);

//----------------------------------------------------
// 🟡 GET LOGGED-IN USER INFO
//----------------------------------------------------
router.get("/me", protect, getMe);

//----------------------------------------------------
// 🟡 UPDATE USER PROFILE
//----------------------------------------------------
router.put(
  "/me",
  [
    // Optional validation
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  protect,
  updateMe
);

//----------------------------------------------------
// 🟡 FUTURE ADMIN ROUTES (commented for expansion)
//----------------------------------------------------
// router.get("/all", protect, adminOnly, getAllUsers);
// router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
