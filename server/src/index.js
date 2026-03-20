import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.router.js";
import connectToDB from "./db/db.js";
import dotenv from 'dotenv';
dotenv.config()

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", userRouter);

app.listen(5000, () => {
  connectToDB()
  console.log("Server running on port 5000");
});