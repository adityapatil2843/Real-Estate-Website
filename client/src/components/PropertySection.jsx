import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, ArrowRight } from "lucide-react";

const PropertySection = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUri } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${backendUri}/api/property/property-list`);
        if (res.data.success) {
          setProperties(res.data.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [backendUri]);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (properties.length === 0) return null;

  return (
    <section id="FeaturedProperties" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
            Premium <span className="text-indigo-600">Stays</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl text-base sm:text-lg font-medium italic">
            Discover our handpicked collection of verified luxury villas in Lonavala.
          </p>
        </div>
        <button 
          onClick={() => navigate("/property")}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-xl shadow-indigo-100 group"
        >
          Explore All Properties
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {properties.map((property) => (
          <div 
            key={property._id}
            onClick={() => navigate(`/property/${property._id}`)}
            className="group cursor-pointer bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
          >
            <div className="aspect-[4/3] w-full relative overflow-hidden rounded-[1.5rem] bg-gray-50 mb-5">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold italic">
                  No Image
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  ₹{property.price?.perNight} / night
                </span>
              </div>
            </div>

            <div className="px-1 flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded">
                  {property.type}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                {property.title}
              </h3>
              
              <div className="flex items-start gap-2 text-gray-500 text-sm mb-5">
                <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="font-semibold leading-tight line-clamp-2">
                  {property.location?.area}, {property.location?.city}
                </span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5 font-bold italic">
                    <Users className="w-4 h-4 text-gray-400" />
                    {property.capacity?.total || property.maxGuests} Guests
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="font-bold italic">{property.bedrooms || 0} BR</span>
                </div>
                <div className="p-2 rounded-full bg-gray-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertySection;