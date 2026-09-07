import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Owner from "../models/owner.model.js";

// Helper to extract JWT token from Cookie OR Authorization Bearer Header
const extractToken = (req) => {
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

// Tourist Middleware (current isAuth logic)
export const protectUser = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error("protectUser Middleware Error:", error.message);
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

// Owner Middleware (new)
export const protectOwner = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      console.log("ProtectOwner ERROR: No token provided");
      return res.status(401).json({ 
        success: false, 
        message: "Authentication failed: No token provided. Please log in." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check role from token
    if (decoded.role !== "owner") {
      console.log("ProtectOwner ERROR: Role mismatch detected", { 
        id: decoded.id, 
        role: decoded.role 
      });
      return res.status(403).json({ 
        success: false, 
        message: `Access denied: Account role is '${decoded.role}', expected 'owner'.` 
      });
    }

    const owner = await Owner.findById(decoded.id).select("-password");

    if (!owner) {
      console.log("ProtectOwner ERROR: Owner ID not found in database", decoded.id);
      return res.status(401).json({ 
        success: false, 
        message: "Owner profile not found. If you recently registered, please ensure you used the Owner Signup." 
      });
    }

    req.owner = owner;
    next();
  } catch (error) {
    console.error("ProtectOwner ERROR: JWT verification failed", error.message);
    return res.status(401).json({ 
      success: false, 
      message: "Session expired or invalid token. Please log in again." 
    });
  }
};

// Unified Middleware for shared routes (e.g. /api/auth/data)
export const protectAny = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check both collections based on role or just check both
    if (decoded.role === "owner") {
      const owner = await Owner.findById(decoded.id).select("-password");
      if (!owner) return res.status(401).json({ success: false, message: "Owner profile not found" });
      req.owner = owner;
      req.userId = owner._id; 
      req.role = "owner";
    } else {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ success: false, message: "User not found" });
      req.user = user;
      req.userId = user._id;
      req.role = user.role;
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};