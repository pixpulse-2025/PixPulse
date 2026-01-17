/**
 * @file db.js
 * @description Configuration for connecting to MongoDB using Mongoose.
 */

import mongoose from "mongoose";

/**
 * Connects to the MongoDB database using the URI provided in environment variables.
 * Exits the process with failure code if the connection fails.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error and exit the application on failure
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
