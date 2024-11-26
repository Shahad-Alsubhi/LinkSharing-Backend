import express from "express";
import cors from "cors";
import connectDB from "./config/DB";
import userRoutes from "./routes/userRoutes"
import cookieParser from "cookie-parser"

const app = express();
connectDB;
app.use(express.json());
app.use(cookieParser())
app.use(cors({ origin: ["http://localhost:5173" , "https://link-sharing-project.vercel.app"] ,credentials:true}));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/users",userRoutes)
