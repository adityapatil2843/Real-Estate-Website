import User from "./user.model.js";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  permissions: {
    type: [String],
    default: ["ALL"]
  }
});

export const Admin = User.discriminator("admin", adminSchema);