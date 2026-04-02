// controllers/property.controller.js
import Property from "../models/property.model.js";

export const getAllProperties = async (req, res) => {
  try {
    console.log("Enter into propert");
    
    const properties = await Property.find(); // fetch all
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties" });
  }
};