// backend/models/users.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // 🔹 User Name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // 🔹 Email (Unique Login Field)
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // 🔹 Password (Hashed Automatically)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // By default, password NEVER returns
    },

    // 🔹 Phone number (future optional)
    phone: {
      type: String,
      default: null,
    },

    // 🔹 Role: Customer / Admin
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    // 🔹 Future: user image
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

//====================================================
// 🟡 PRE-SAVE → Hash Password
//====================================================
userSchema.pre("save", async function (next) {
  // যদি password change না করা হয়, skip
  if (!this.isModified("password")) return next();

  // Hashing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

//====================================================
// 🟡 MATCH PASSWORD (Login Checker)
//====================================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
