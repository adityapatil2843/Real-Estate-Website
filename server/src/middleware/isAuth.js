import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    // 1. Get token ONLY from cookies
   const token = req.cookies.token

   console.log("TOKEN (isAuth):", token);
   console.log("Cookies:", req.cookies);

    // 2. If no token → reject
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token step 2 provided",
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get userId from token
    const userId = decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // 5. Find user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 6. Attach to request
    req.user = user;
    req.userId = user._id;

    // 7. Continue
    next();} catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default isAuth;