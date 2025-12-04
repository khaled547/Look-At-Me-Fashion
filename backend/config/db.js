// backend/config/db.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MongoDB Connect
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);

    // Stop server if DB fails
    process.exit(1);
  }
};

module.exports = connectDB;
