import { Owner } from "../models/owner.model.js";
import User from "../models/user.model.js";
import Property from "../models/property.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";

export const getDashboardMetrics = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeListings = await Property.countDocuments({ status: "live" });
    const pendingApprovals = await Property.countDocuments({ status: "pending" });
    
    // Sum total platform revenue (using totalAmount from bookings)
    const bookings = await Booking.find();
    let revenue = 0;
    for (let i = 0; i < bookings.length; i++) {
      revenue += (bookings[i].totalAmount || 0);
    }

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        platformRevenue: revenue,
        activeListings,
        pendingApprovals
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwners = async (req, res) => {
  try {
    // Return users with role='owner'
    const owners = await Owner.find().select("-password");
    res.status(200).json({ success: true, count: owners.length, data: owners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOwnerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const owner = await Owner.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListings = async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "name email");
    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("property", "title location")
      .populate("tourist", "name");
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const processPayout = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { payoutStatus: "Released", payoutDate: new Date() }, 
      { new: true }
    );
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTourists = async (req, res) => {
  try {
    // Need users with role='tourist' or buyers
    const tourists = await User.find({ role: "tourist" }).select("-password");
    res.status(200).json({ success: true, count: tourists.length, data: tourists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTouristStatus = async (req, res) => {
  try {
    const { status } = req.body; // pending, verified, suspended
    const tourist = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: tourist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("property", "title")
      .populate("tourist", "name");
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const moderateReview = async (req, res) => {
  try {
    const { status } = req.body; // e.g. Removed, Flagged, Live
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id).populate("owner", "name email phone role status");
    
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Find other properties by the same owner
    const otherProperties = await Property.find({ 
      owner: property.owner._id, 
      _id: { $ne: id } 
    }).select("title status type price location");

    res.status(200).json({ 
      success: true, 
      data: {
        property,
        otherProperties
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
