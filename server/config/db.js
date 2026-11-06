const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURL =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/foodeazy";
  try {
    const conn = await mongoose.connect(mongoURL);
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
