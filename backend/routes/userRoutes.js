const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/user");


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    const exist = await User.findOne({ phone });
    if (exist) return res.status(400).json({ msg: "Phone already registered" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      email,
      password: hash
    });

    res.json({ msg: "Registered successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Logged in",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ msg: "Login error", error: err.message });
  }
});

module.exports = router;
