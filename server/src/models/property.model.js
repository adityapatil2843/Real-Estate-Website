import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  description: String,
 // owner: {
 //   type: mongoose.Schema.Types.ObjectId,
 //   ref: "owner"
 // },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},

  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Property", propertySchema);