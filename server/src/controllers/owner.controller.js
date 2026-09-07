import Property from "../models/property.model.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import Owner from "../models/owner.model.js";

export const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.owner._id;
    const properties = await Property.find({ owner: ownerId });
    const propertyIds = properties.map(p => p._id);
    
    const bookings = await Booking.find({ property: { $in: propertyIds } });
    
    let totalEarnings = 0;
    let pendingPayoutAmount = 0;
    let pendingBookingsCount = 0;

    for (const booking of bookings) {
      if (booking.status === "Pending" || booking.status === "pending") {
        pendingBookingsCount += 1;
      }
      
      if (booking.payoutStatus === "Released" || booking.payoutStatus === "released") {
        totalEarnings += booking.totalAmount || 0;
      } else if (booking.payoutStatus === "Pending" || booking.payoutStatus === "pending") {
        pendingPayoutAmount += booking.totalAmount || 0;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalPropertiesCount: properties.length,
        totalBookingsCount: bookings.length,
        pendingBookingsCount,
        totalEarnings,
        pendingPayoutAmount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitKyc = async (req, res) => {
  try {
    const { aadhaar, pan, gstNumber, bankAccount, ifscCode } = req.body;
    
    // Find owner from middleware data
    const owner = await Owner.findById(req.owner._id);
    
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Update KYC fields
    owner.aadhaar = aadhaar;
    owner.pan = pan;
    owner.gstNumber = gstNumber;
    owner.bankAccount = bankAccount;
    owner.ifscCode = ifscCode;
    owner.kycStatus = "pending";
    owner.kycSubmittedAt = new Date();

    const updatedOwner = await owner.save();
    
    // Exclude password
    const { password, ...ownerData } = updatedOwner._doc;

    res.status(200).json({ 
      success: true, 
      message: "KYC submitted successfully", 
      data: ownerData 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createProperty = async (req, res) => {
  try {
    // Parse the stringified 'propertyData' from the MultiPart form
    const propertyData = req.body.propertyData ? JSON.parse(req.body.propertyData) : {};
    
    // Process Images
    if (req.files && req.files.images) {
      const imageFiles = req.files.images;
      const uploadPromises = imageFiles.map(file => 
        uploadOnCloudinary(file.path, "properties/images", "image")
      );
      const uploadResults = await Promise.all(uploadPromises);
      
      // Filter out failed uploads (null values) and get secure URLs
      propertyData.images = uploadResults
        .filter(result => result !== null)
        .map(result => result.secure_url);
    }

    // Process Video
    if (req.files && req.files.video) {
      const videoFile = req.files.video[0];
      const uploadResult = await uploadOnCloudinary(videoFile.path, "properties/videos", "video");
      if (uploadResult) {
        propertyData.video = uploadResult.secure_url;
      }
    }

    propertyData.status = "pending"; 
    propertyData.owner = req.owner._id; 
    
    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();
    
    res.status(201).json({ success: true, data: savedProperty });
  } catch (error) {
    console.error("Property Creation Error:", error);
    res.status(500).json({ message: error.message || "Failed to create property" });
  }
};

export const getOwnerProperties = async (req, res) => {
  try {
    const ownerId = req.owner._id;
    const properties = await Property.find({ owner: ownerId });
    
    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const updateData = req.body;
    
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $set: updateData },
      { new: true }
    );
    
    res.status(200).json({ success: true, data: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    
    const activeBookings = await Booking.find({ 
      property: propertyId, 
      status: { $in: ["Confirmed", "confirmed"] } 
    });
    
    if (activeBookings.length > 0) {
      return res.status(400).json({ message: "Cannot delete property with active bookings" });
    }
    
    await Property.findByIdAndDelete(propertyId);
    
    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.owner._id;
    const properties = await Property.find({ owner: ownerId });
    const propertyIds = properties.map(p => p._id);
    
    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate("tourist", "name phone")
      .populate("property", "title location.area");
      
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const { status } = req.body;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status: status } },
      { new: true }
    );
    
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerReviews = async (req, res) => {
  try {
    const ownerId = req.owner._id;
    const properties = await Property.find({ owner: ownerId });
    const propertyIds = properties.map(p => p._id);
    
    const reviews = await Review.find({ property: { $in: propertyIds } })
      .populate("tourist", "name")
      .populate("property", "title");
      
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerEarnings = async (req, res) => {
  try {
    const ownerId = req.owner._id;
    const properties = await Property.find({ owner: ownerId });
    const propertyIds = properties.map(p => p._id);
    
    const bookings = await Booking.find({ property: { $in: propertyIds } });
    
    let totalEarned = 0;
    let pendingPayout = 0;
    const recentPayouts = [];

    // Sorting bookings by payoutDate or createdAt to get "recent" payouts if needed, 
    // but just mapping them for now based on status
    for (const booking of bookings) {
      if (booking.payoutStatus === "Released" || booking.payoutStatus === "released") {
        totalEarned += booking.totalAmount || 0;
        recentPayouts.push(booking);
      } else if (booking.payoutStatus === "Pending" || booking.payoutStatus === "pending") {
        pendingPayout += booking.totalAmount || 0;
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalEarned,
        pendingPayout,
        recentPayouts: recentPayouts.slice(-10) // Just returning the last 10 
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};