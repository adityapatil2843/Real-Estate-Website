import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role: { type: String, enum: ["tourist", "admin"], default: "tourist" },
    status: { type: String, enum: ["pending", "verified", "suspended"], default: "pending" },
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  isAccountVerified: { type: Boolean, default: false },

    // OTP fields
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },

    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },

    refreshToken: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);