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
  image: {
  type: String,
  default: function () {
    const images = [
      "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775110349/dummyVilla_xz0gjw.jpg",
      "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775109825/dummyProperty_kcvcwd.jpg",
      "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775110793/dummyHotel_wbsoub.avif",
      "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775110910/dummyApartment_lxy9vq.jpg"
    ];
    return images[Math.floor(Math.random() * images.length)];
  }
},


  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Property", propertySchema);