import React, { useEffect, useState, useContext } from "react";
{/*
import {dummyProperty} from "../assets/dummyProperty.jpg";
import {dummyVilla} from "../assets/dummyVilla.jpg";
*/}
import axios from "axios";
import { AppContent } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const PropertySection = () => {
  const [properties, setProperties] = useState([]);
  const { backendUri } = useContext(AppContent);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(backendUri + "/api/property/property-list");
        setProperties(res.data);
      } catch (error) {
        console.error("Error fetching properties", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Property Listings
      </h2>

      {properties.length === 0 ? (
        <p className="text-center text-gray-500">No properties found</p>
      ) : (
        <div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> 
            {/* Note: I adjusted the grid to lg:grid-cols-2 to look better with 4 items (2x2) */}
            {properties.slice(0, 3).map((property) => (
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
                    <span className="text-gray-400">No Image Available</span>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2">
                    {property.title}
                  </h3>
                
                  <p className="text-green-600 font-bold mb-1">
                    ₹{property.price}
                  </p>
                
                  <p className="text-gray-600 text-sm">
                     {property.location}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Status: <span className="font-medium">{property.status}</span>
                  </p>
                
                  {/* Book Now Button */}
                  <button 
                    className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    onClick={() => console.log(`Booking property: ${property._id}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
           View More Action 
          {properties.length > 4 && (
            <div className="mt-8 text-center">
              <button 
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
                onClick={()=>navigate("/property")}
              >
                View More Properties →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertySection;

