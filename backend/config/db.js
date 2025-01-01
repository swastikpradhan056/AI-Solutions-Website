const mongoose = require("mongoose");
const dotenv = require("dotenv"); // Load environment variables

dotenv.config();

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI); // Debug line
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(
      "Error occurred while connecting to MongoDB: ",
      error.message
    );
    process.exit(1); // Exit with failure codex
  }
};

module.exports = connectDB;
