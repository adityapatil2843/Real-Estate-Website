import {asyncHandler} from "../utils/asyncHandler.js";
import { Owner } from "../models/owner.model.js";
import Property from "../models/property.model.js";
import isAuth from "../middleware/isAuth.js";
// POST PROPERTY (Owner only)

export const createProperty = asyncHandler(async (req, res) => {

  /*
  console.log("Owner controller USER:", req.user);

  // 1. Auth Check
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please log in first."
    });
  }*/
  //req.user = { _id: "65f2a1b3c9e8d745a1234567" };
  const { 
    title, 
    description, 
    location, // Should be an object: { city, address, area, coordinates }
    capacity, // Should be an object: { adults, children, total }
    price,    // Should be an object: { perNight, cleaningFee }
    type, 
    amenities,
    images 
  } = req.body;

  // 2. Strict Validation based on our new schema's required fields
  if (!title || !price?.perNight || !location?.city || !location?.address || !type || !capacity?.total) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing: Title, perNight price, city, address, property type, and total capacity are all required."
    });
  }

  // 3. Build the property object
  const propertyData = {
    title,
    description,
    location,
    capacity,
    price,
    type,
    amenities: amenities || [], // Default to empty array if none provided
    //owner: req.user._id, // Assign the logged-in user as the owner
    status: "pending" // Falls back to default anyway, but good for visibility
  };

  // Only add images if the user actually sent some, otherwise Mongoose runs the default function
  if (images && images.length > 0) {
    propertyData.images = Array.isArray(images) ? images : [images];
  }

  // 4. Create in Database
  const property = await Property.create(propertyData);

  res.status(201).json({
    success: true,
    message: "Property created successfully and is pending approval",
    data: property
  });
});