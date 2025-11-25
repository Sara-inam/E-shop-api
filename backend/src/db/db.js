import mongoose from "mongoose";
import config from "../../config.js";
import logger from "../config/logger.js";

const connectdb = async () => {
  try {
    const options = {
      maxPoolSize: 10, // maximum connections in pool
      minPoolSize: 2,  // minimum idle connections
      serverSelectionTimeoutMS: 5000, // timeout for initial connection
      socketTimeoutMS: 45000, // timeout for operations
    };

    await mongoose.connect(config.MONGO_URI, options);

    logger.info(" Database connected successfully");
    logger.info(` Mongo URI: ${config.MONGO_URI}`);
    logger.info(` Pool Size → Min: ${options.minPoolSize}, Max: ${options.maxPoolSize}`);

  } catch (error) {
    logger.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }

  // Optional: log when connection disconnected
  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️ MongoDB connection lost. Trying to reconnect...");
  });
};

export default connectdb;
