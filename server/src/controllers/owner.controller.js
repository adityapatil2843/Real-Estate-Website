import {asyncHandler} from "../utils/asyncHandler.js";
import { Owner } from "../models/owner.model.js";
import Property from "../models/property.model.js";
import isAuth from "../middleware/isAuth.js";

// POST PROPERTY (Owner only)
export const createProperty = asyncHandler(async (req, res) => {
  console.log("ownwe controller USER:", req.user);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  /*const ownerId = req.user._id;

  // Check if owner exists
  const owner = await Owner.findById(ownerId);
  if (!owner) {
    return res.status(404).json({
      success: false,
      message: "Owner not found"
    });
  }*/

  const { title, description, price, location } = req.body;

  if (!title || !price || !location) {
    return res.status(400).json({
      success: false,
      message: "Title, price and location are required"
    });
  }

  const property = await Property.create({
    title,
    description,
    price,
    location,
    //owner: ownerId
  });

  res.status(201).json({
    success: true,
    message: "Property created successfully",
    data: property
  });
});