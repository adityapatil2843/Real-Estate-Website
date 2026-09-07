import express from "express";
import { protectOwner } from "../middleware/isAuth.js";
import upload from "../middleware/upload.js";
import {
  getOwnerDashboard,
  createProperty,
  getOwnerProperties,
  updateProperty,
  deleteProperty,
  getOwnerBookings,
  updateBookingStatus,
  getOwnerReviews,
  getOwnerEarnings,
  submitKyc
} from "../controllers/owner.controller.js";

const ownerRoutes = express.Router();

// Middleware
ownerRoutes.use(protectOwner);

// Dashboard
ownerRoutes.get("/dashboard", getOwnerDashboard);

// Properties
ownerRoutes.post("/properties", upload.fields([
  { name: "images", maxCount: 4 },
  { name: "video", maxCount: 1 }
]), createProperty);
ownerRoutes.get("/properties", getOwnerProperties);
ownerRoutes.put("/properties/:propertyId", updateProperty);
ownerRoutes.delete("/properties/:propertyId", deleteProperty);

// Bookings
ownerRoutes.get("/bookings", getOwnerBookings);
ownerRoutes.patch("/bookings/:bookingId/status", updateBookingStatus);

// Reviews
ownerRoutes.get("/reviews", getOwnerReviews);

// Earnings
ownerRoutes.get("/earnings", getOwnerEarnings);

// KYC Submission
ownerRoutes.put("/kyc", submitKyc);

// Fallback route for 404 debugging
ownerRoutes.use("/", (req, res) => {
  console.log("OWNER ROUTE ERROR: 404 Not Found", {
    method: req.method,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path
  });
  res.status(404).json({
    success: false,
    message: `Owner endpoint '${req.originalUrl}' not found. Check route definition.`
  });
});

export default ownerRoutes;
