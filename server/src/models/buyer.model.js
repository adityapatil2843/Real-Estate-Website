import User from "./user.model.js";
import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property"
    }
  ]
});

export const Buyer = User.discriminator("buyer", buyerSchema);