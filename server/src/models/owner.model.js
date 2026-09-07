import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
    // Auth fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "owner" },

    // Verification fields
    kycStatus: { 
        type: String, 
        enum: ["not_submitted", "pending", "verified", "rejected"], 
        default: "not_submitted" 
    },
    status: { 
        type: String, 
        enum: ["pending", "verified", "suspended", "rejected"], 
        default: "pending" 
    },
    aadhaar: { type: String },
    pan: { type: String },
    gstNumber: { type: String },
    bankAccount: { type: String },
    ifscCode: { type: String },
    kycSubmittedAt: { type: Date },

    // Property refs
    properties: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property"
        }
    ],

    // Token & OTP fields (Copied from existing User model used in discriminator)
    isAccountVerified: { type: Boolean, default: false },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
    refreshToken: { type: String, default: "" },

}, { timestamps: true });

export const Owner = mongoose.model("Owner", ownerSchema);
export default Owner;