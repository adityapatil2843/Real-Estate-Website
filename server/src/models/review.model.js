import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  snippet: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Live", "Flagged", "Removed"],
    default: "Live"
  },
  flagReason: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
