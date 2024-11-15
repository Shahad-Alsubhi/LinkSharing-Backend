import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = mongoose
  .connect(process.env.MONGODB!)
  .then(() => {
    console.log("MongoDB connection open");
  })
  .catch((e) => {
    console.log("MongoDB connection error:", e);
    
  }
);
export default connectDB;
