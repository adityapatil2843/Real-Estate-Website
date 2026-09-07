import mongoose from 'mongoose'

// Tracks every admin action — shows up in the dashboard activity feed
const adminLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      // e.g. "OWNER_APPROVED", "LISTING_REJECTED", "PAYOUT_RELEASED"
    },
    targetType: {
      type: String,
      enum: ["Owner", "Listing", "Booking", "Tourist", "Review", "Payment"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    targetName: {
      type: String, // human-readable label e.g. "Ravi Patil", "Sunrise Villa"
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    note: {
      type: String, // optional reason/note
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdminLog", adminLogSchema);