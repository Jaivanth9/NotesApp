import mongoose from "mongoose";
import { ENV } from "../config/env";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      // options can be added if needed
    } as mongoose.ConnectOptions);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
