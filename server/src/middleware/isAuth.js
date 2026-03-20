import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    // 1. Extract token from cookies
    let token = req.cookies.token;

    console.log("TOKEN (isAuth):", token);
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers.authorization);

    // 2. If not in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
    }

    // 3. If still no token → reject
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Validate payload
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // 6. Check if user exists
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 7. Attach user to request
    req.user = user;
    req.userId = user._id;

    // 8. Proceed
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default isAuth;