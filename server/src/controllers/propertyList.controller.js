import Property from "../models/property.model.js";

// Check date overlap
const isDateAvailable = (bookedDates = [], checkIn, checkOut) => {
  return !bookedDates.some((booking) => {
    return (
      new Date(checkIn) < new Date(booking.checkOut) &&
      new Date(checkOut) > new Date(booking.checkIn)
    );
  });
};

export const searchProperties = async (req, res) => {
  try {
    // ✅ Use body instead of query (for Postman JSON)
    const { location, checkIn, checkOut, adults, children } = req.query;

    const totalGuests =
      (Number(adults) || 0) + (Number(children) || 0) || 1;

    // ✅ Dynamic query object
    let query = {
      status: "live" // 👈 Essential: Show only approved properties
    };

    if (location && location.trim() !== '') {
      const searchTerms = location.trim().split(/\s+/).join('|');
      query["$or"] = [
        { "location.city": { $regex: searchTerms, $options: "i" } },
        { "location.address": { $regex: searchTerms, $options: "i" } },
        { "location.area": { $regex: searchTerms, $options: "i" } },
        { title: { $regex: searchTerms, $options: "i" } }
      ];
    }

    if (totalGuests > 0) {
      query["capacity.total"] = { $gte: totalGuests };
    }

    // Step 1: DB filter with sorting (newest first)
    let properties = await Property.find(query).sort({ createdAt: -1 });

    // Step 2: Date filtering
    if (checkIn && checkOut) {
      properties = properties.filter((property) =>
        isDateAvailable(property.bookedDates, checkIn, checkOut)
      );
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "live" }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching properties" });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email phone status");
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching property details" });
  }
};