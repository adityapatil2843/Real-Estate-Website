import User from "./user.model.js";
import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  companyName: String,
  properties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property"
    }
  ]
});

export const Owner = User.discriminator("owner", ownerSchema);