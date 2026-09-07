import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.router.js";
import adminRoutes from "./routes/admin.router.js";
import ownerRoutes from "./routes/owner.routes.js";
import propertyListrouter from "./routes/propertyList.router.js"
import connectToDB from "./db/db.js";
import dotenv from 'dotenv';
dotenv.config()

const app = express();

// Trust reverse proxy (essential for Render / Cloudflare to handle secure cookies properly)
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

// Dynamic CORS configuration for local development and Vercel production
const configuredClientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim().replace(/\/$/, ""))
  : [];

const localOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed =
        localOrigins.includes(origin) ||
        configuredClientUrls.includes(origin) ||
        origin.endsWith(".vercel.app");

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Real Estate API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", userRouter);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/property", propertyListrouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server running on port ${PORT}`);
});