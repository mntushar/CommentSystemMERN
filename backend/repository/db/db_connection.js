import mongoose from "mongoose";

export async function connectDB() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.DB_NAME,
      autoIndex: true,
    });
  } catch (error) {
    throw error;
  }
}
