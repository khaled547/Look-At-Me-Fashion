const mongooese = require('mongoose');

const connectDB = async () => {
    try {
        await mongooese.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB Error:", error);
        process.exit(1);
        
    }
    
};

module.exports = connectDB;