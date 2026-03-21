import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  userAuth,
  isAuthenticated,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
  resetPassword,
} from "../controllers/user.controller.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/data",isAuth, getUser);
router.post("/logout", logoutUser);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);


router.get("/is-auth", isAuth, isAuthenticated);

router.post("/send-verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-account", userAuth, verifyEmail);

export default router;