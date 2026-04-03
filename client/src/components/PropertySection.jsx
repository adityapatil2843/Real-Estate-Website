import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const PropertySection = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUri } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${backendUri}/api/property/property-list`
        );

        // Handle API response safely
        const data = res?.data?.data || res?.data || [];

        setProperties(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (backendUri) {
      fetchProperties();
    }
  }, [backendUri]);

  // Loading State
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading properties...
      </p>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Property Listings
      </h2>

      {/* No Data */}
      {properties.length === 0 ? (
        <p className="text-center text-gray-500">
          No properties found
        </p>
      ) : (
        <>
          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.slice(0, 3).map((property) => (
              <div
                key={property?._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                  {property?.image ? (
                    <img
                      src={property.image}
                      alt={property?.title || "Property"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">
                      No Image Available
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-2">
                    {property?.title || "Untitled Property"}
                  </h3>

                  {/* Price */}
                  <p className="text-green-600 font-bold">
                    ₹{property?.price?.perNight ?? "N/A"} / night
                  </p>

                  {/* Cleaning Fee */}
                  {property?.price?.cleaningFee ? (
                    <p className="text-gray-500 text-sm mb-2">
                      Cleaning Fee: ₹{property.price.cleaningFee}
                    </p>
                  ) : null}

                  {/* Location */}
                  <div className="text-gray-600 text-sm mb-2">
                    <p>
                      {property?.location?.city ||
                        "City not available"}
                    </p>
                    <p className="text-gray-500">
                      {property?.location?.address || ""}
                    </p>
                  </div>

                  {/* Status */}
                  <p className="text-gray-600 text-sm mb-4">
                    Status:{" "}
                    <span className="font-medium">
                      {property?.status || "Unknown"}
                    </span>
                  </p>

                  {/* Button */}
                  <button
                    className="mt-auto bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() =>
                      navigate(`/property/${property?._id}`)
                    }
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View More */}
          {properties.length > 3 && (
            <div className="text-center mt-8">
              <button
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => navigate("/property")}
              >
                View More Properties →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertySection;