import express from "express";
import cors from "cors";
import connectDB from "./config/DB";
import userRoutes from "./routes/userRoutes"

const app = express();
connectDB;
app.use(express.json());
app.use(express.urlencoded())
app.use(cors({ origin: "http://localhost:5173" }));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/users",userRoutes)
