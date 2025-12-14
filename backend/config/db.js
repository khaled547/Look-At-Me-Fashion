// backend/config/db.js

const { default: mongoose } = require("mongoose");
const mongooes = require("mongoose");

const connectDB = async () => {
  try {
    await 
    mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
    
  } catch (error) {
  console.error("MongoDB Connection Error:", error);
  }
};

module.exports = connectDB;