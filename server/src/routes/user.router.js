import express from "express";
import {
  registerUser,
  registerOwner,
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

import { protectUser, protectAny } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/owner/register", registerOwner);
router.post("/login", loginUser);
router.get("/data", protectAny, getUser);
router.post("/logout", logoutUser);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);


router.get("/is-auth", protectAny, isAuthenticated);

router.post("/send-verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-account", userAuth, verifyEmail);

export default router;