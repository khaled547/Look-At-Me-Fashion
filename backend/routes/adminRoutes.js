const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAdminSummary } = require("../controllers/adminController");

router.get("/summary", protect, adminOnly, getAdminSummary);

module.exports = router;
