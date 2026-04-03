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
    let query = {};

    if (location && location.trim() !== '') {
      query["$or"] = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.address": { $regex: location, $options: "i" } },
        { "location.area": { $regex: location, $options: "i" } },
        { title: { $regex: location, $options: "i" } }
      ];
    }

    query["capacity.total"] = { $gte: totalGuests };

    // Step 1: DB filter
    let properties = await Property.find(query);

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