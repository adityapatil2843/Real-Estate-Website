import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx";
import { AppContent } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, ArrowRight } from "lucide-react";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUri } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${backendUri}/api/property/property-list`);
        if (res.data.success) {
          setProperties(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    window.scrollTo(0, 0);
  }, [backendUri]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            Explore All <span className="text-indigo-600">Lonavala</span> Properties
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium italic">
            Browse our complete collection of verified luxury villas and cozy hideaways.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-bold text-xl">No properties currently available.</p>
            <p className="text-gray-400 mt-2">Please check back later or try a different search.</p>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => {
              const perNight = property.price?.perNight || 0;
              const images = property.images || [];

              return (
                <div
                  key={property._id}
                  onClick={() => navigate(`/property/${property._id}`)}
                  className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group border border-transparent hover:border-gray-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 mb-6 relative">
                    {images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold italic">
                        No Image Available
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-1.5 bg-black/50 backdrop-blur-md text-white rounded-full text-xs font-black shadow-lg">
                        ₹{perNight}
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="px-2 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 px-2 py-0.5 bg-indigo-50 rounded-md">
                        {property.type}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                      {property.title}
                    </h3>

                    <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="font-semibold leading-tight">{property.location?.area}, {property.location?.city}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1 font-bold italic"><Users className="w-4 h-4" /> {property.capacity?.total || property.maxGuests}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="font-bold italic">{property.bedrooms || 0} BR</span>
                      </div>
                      <div className="p-2 rounded-full bg-gray-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertyList;