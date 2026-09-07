import express from "express";
import {
  getDashboardMetrics,
  getOwners,
  updateOwnerStatus,
  getListings,
  updateListingStatus,
  getBookings,
  processPayout,
  getTourists,
  updateTouristStatus,
  getReviews,
  moderateReview,
  getListingDetails
} from "../controllers/admin.controller.js";

const adminRoutes = express.Router();

// Dashboard
adminRoutes.get("/metrics", getDashboardMetrics);

// Owners
adminRoutes.get("/owners", getOwners);
adminRoutes.patch("/owners/:id/status", updateOwnerStatus);

// Listings
adminRoutes.get("/listings", getListings);
adminRoutes.get("/listings/:id", getListingDetails);
adminRoutes.patch("/listings/:id/status", updateListingStatus);

// Bookings & Payments
adminRoutes.get("/bookings", getBookings);
adminRoutes.patch("/bookings/:id/payout", processPayout);

// Tourists
adminRoutes.get("/tourists", getTourists);
adminRoutes.patch("/tourists/:id/status", updateTouristStatus);

// Reviews
adminRoutes.get("/reviews", getReviews);
adminRoutes.patch("/reviews/:id/status", moderateReview);

export default adminRoutes;
