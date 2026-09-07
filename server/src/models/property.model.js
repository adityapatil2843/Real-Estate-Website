import mongoose from "mongoose";


const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Property title is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Property description is required"]
  },

  location: {
    city: { type: String, required: true, trim: true },
    area: { type: String, trim: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },

  capacity: {
    adults: { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true }
  },

  price: {
    perNight: { type: Number, required: true, min: 0 },
    cleaningFee: { type: Number, default: 0, min: 0 }
  },

  type: {
    type: String,
    enum: ["Villa", "Apartment", "Farmhouse", "Resort", "Cottage", "Bungalow"],
    required: true
  },

  amenities: [{ type: String }],

  bookedDates: [
    {
      checkIn: { type: Date, required: true },
      checkOut: { type: Date, required: true }
    }
  ],

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Owner" 
  },

  images: {
    type: [String],
    default: function () {
      const dummyImages = [
        "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775110910/dummyApartment_lxy9vq.jpg",
        "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775110793/dummyHotel_wbsoub.avif",
        "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775110349/dummyVilla_xz0gjw.jpg",
        "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775109825/dummyProperty_kcvcwd.jpg",
    ];
      return [dummyImages[Math.floor(Math.random() * dummyImages.length)]];
    }
  },

  video: {
    type: String,
    default: ""
  },

  status: { 
    type: String, 
    enum: ["pending", "live", "rejected", "unpublished"], 
    default: "pending" 
  }
}, { timestamps: true });

// ⚡ Add an index to location.city for high-performance searching
propertySchema.index({ "location.city": 1 });

export default mongoose.model("Property", propertySchema);
/**default: function () {
    const images = ['
      "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775110349/dummyVilla_xz0gjw.jpg",
      "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775109825/dummyProperty_kcvcwd.jpg",
      "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775110793/dummyHotel_wbsoub.avif",
      "https://res.cloudinary.com/djqbpniai/image/upload/q_auto/f_auto/v1775110910/dummyApartment_lxy9vq.jpg"
    ];
    return images[Math.floor(Math.random() * images.length)];
  } */