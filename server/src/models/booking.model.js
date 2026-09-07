import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true
  },
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  dates: {
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Refund Requested", "Refunded"],
    default: "Pending"
  },
  payoutStatus: {
    type: String,
    enum: ["Pending", "Released", "Action Needed"],
    default: "Pending"
  },
  payoutDate: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
