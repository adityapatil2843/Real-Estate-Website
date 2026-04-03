import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../components/Header.jsx"
import { AppContent } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const { backendUri } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${backendUri}/api/property/property-list`);
        setProperties(res.data);
      } catch (error) {
        console.error("Error fetching properties", error);
      }
    };

    fetchProperties();
  }, [backendUri]);

  return (
    <>
      <div className="p-4 md:p-8">
        <Header />
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Property Listings
        </h2>

        {properties.length === 0 ? (
          <p className="text-center text-gray-500">No properties found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const perNight = property.price?.perNight || 0;
              const cleaningFee = property.price?.cleaningFee || 0;
              const totalPrice = perNight + cleaningFee;

              return (
                <div
                  key={property._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                    {property.image ? (
                      <img
                        src={property.image}
                        alt={property.title}
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
                    <h3 className="text-lg font-semibold mb-2">
                      {property.title}
                    </h3>

                    {/* Price Breakdown */}
                    <p className="text-sm text-gray-500">
                      ₹{perNight} / night
                    </p>
                    <p className="text-sm text-gray-500">
                      Cleaning: ₹{cleaningFee}
                    </p>

                    {/* Total Price */}
                    <p className="text-green-600 font-bold mb-2">
                      Total: ₹{totalPrice}
                    </p>

                    <p className="text-gray-600 text-sm">
                      {property.location?.address}, {property.location?.city}
                    </p>

                    <p className="text-gray-600 text-sm mb-4">
                      Status:{" "}
                      <span className="font-medium">
                        {property.status}
                      </span>
                    </p>

                    {/* Book Now Button */}
                    <button
                      className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                      onClick={() => navigate(`/property/${property._id}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyList;