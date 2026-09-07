import User from "../models/user.model.js";
import Owner from "../models/owner.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import genToken from "../utils/token.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if ([name, email, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ name }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role === "admin" ? "admin" : "tourist" // Strictly restrict to non-owner roles
    });

    const createdUser = await User.findById(user._id).select("-password");

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Set cookie
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({
        success: true,
        user: createdUser,
        token,
        message: "User registered successfully"
    });
});

export const registerOwner = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check both collections
    const existedUser = await User.findOne({ email });
    const existedOwner = await Owner.findOne({ email });

    if (existedUser || existedOwner) {
        throw new ApiError(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await Owner.create({
        name,
        email,
        password: hashedPassword,
        role: "owner"
    });

    const createdOwner = await Owner.findById(owner._id).select("-password");

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: owner._id, role: "owner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Set cookie
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({
        success: true,
        user: createdOwner,
        token,
        message: "Owner registered successfully"
    });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // 1. Query User collection
  let foundUser = await User.findOne({ email });
  let foundOwner = null;

  // 2. If not found in User, query Owner collection
  if (!foundUser) {
    foundOwner = await Owner.findOne({ email });
  }

  // 4. If both are null
  if (!foundUser && !foundOwner) {
    return res.status(404).json({
      success: false,
      message: "No account found with this email"
    });
  }

  // 5. Set account
  const account = foundUser || foundOwner;

  // 6. Compare password
  const isMatch = await bcrypt.compare(password, account.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password",
    });
  }

  // 8. Generate JWT
  const token = jwt.sign(
    { id: account._id, role: account.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 9. Send token (cookie)
  res.cookie("token", token, getCookieOptions());

  // 10. Return response
  return res.status(200).json({
    success: true,
    role: account.role,
    name: account.name,
    token // Send token in response too as per current flow
  });
});


// LOGOUT
export const logoutUser = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.json({
    success: true,
    message: "Logged out"
  });

};


export const userAuth = async (req, res, next) => {
  try {
    // Try cookie first, then Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user; // attach full user (without password)
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

// GET USER/OWNER DATA
export const getUser = async (req, res) => {
  try {
    const account = req.user || req.owner;
    
    if (!account) {
        return res.status(404).json({ success: false, message: "Account not found" });
    }

    res.json({
      success: true,
      user: account
    });

  } catch (error) {
    console.error("getUser Error:", error);
    res.json({ success: false, message: "error in get profile" });
  }
};

/* ================= AUTH CHECK ================= */
export const isAuthenticated = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, "Authenticated"));
});

/* ================= SEND VERIFY OTP ================= */
export const sendVerifyOtp = asyncHandler(async (req, res) => {
  const user = req.user; // ✅ FIXED

  if (!user) throw new ApiError(404, "User not found");

  if (user.isAccountVerified) {
    return res.json(new ApiResponse(200, null, "Account already verified"));
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));

  user.verifyOtp = otp;
  user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Email Verification OTP",
    html: `<h2>Your OTP</h2><p><b>${otp}</b></p>`
  });

  res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

/* ================= VERIFY EMAIL ================= */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const user = req.user; // ✅ use middleware data

  if (!user) throw new ApiError(404, "User not found");

  if (
    user.verifyOtp !== String(otp) ||
    user.verifyOtpExpireAt < Date.now()
  ) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  user.isAccountVerified = true;
  user.verifyOtp = "";
  user.verifyOtpExpireAt = 0;

  await user.save();

  res.status(200).json(
    new ApiResponse(200, null, "Email verified successfully")
  );
});

/* ================= SEND RESET OTP ================= */
export const sendResetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.resetOtp = otp;
  user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
  await user.save();

  await sendEmail({
  to: user.email,
  subject: "Password Reset OTP",
  html: `
    <h2>Password Reset</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>This OTP expires in 15 minutes.</p>
  `,
});

  res.status(200).json(new ApiResponse(200, null, "OTP sent to email"));
});

/* ================= RESET PASSWORD ================= */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) throw new ApiError(400, "Email, OTP and new password are required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.resetOtp !== otp || user.resetOtpExpireAt < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOtp = "";
  user.resetOtpExpireAt = 0;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});