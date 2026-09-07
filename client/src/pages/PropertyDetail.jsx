import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../context/AppContext.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { 
  MapPin, Users, Check, Info, Phone, Mail, 
  ArrowLeft, Calendar, ShieldCheck, Share2, 
  BedDouble, Bath, Wifi, Tv, Coffee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUri } = useContext(AppContent);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${backendUri}/api/property/${id}`);
        if (res.data.success) {
          setProperty(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching property", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
    window.scrollTo(0, 0);
  }, [id, backendUri]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-gray-800">Property not found</h2>
      <button 
        onClick={() => navigate("/property")}
        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Back to Listings
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          
          <div className="flex items-center gap-4">
            <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition text-gray-500">
               <Share2 className="w-5 h-5" />
            </button>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase rounded-full border border-indigo-200">
              Verified Listing
            </span>
          </div>
        </div>

        {/* Hero Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[400px] md:h-[600px]">
           <div className="md:col-span-2 relative group overflow-hidden rounded-2xl md:rounded-l-3xl">
              <img 
                src={property.images?.[0] || 'https://via.placeholder.com/800'} 
                alt="Main" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
           </div>
           <div className="hidden md:grid grid-rows-2 gap-4 col-span-1">
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <img src={property.images?.[1] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt="Property" />
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <img src={property.images?.[2] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt="Property" />
              </div>
           </div>
           <div className="hidden md:block col-span-1 relative rounded-r-3xl overflow-hidden group">
              <img 
                src={property.images?.[3] || property.images?.[0]} 
                alt="Exterior" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer backdrop-blur-sm">
                 <span className="text-white font-bold">View All 12 Photos</span>
              </div>
           </div>
        </div>

        {/* Property Info Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* Left: Main Details */}
           <div className="lg:col-span-2 space-y-10">
              
              {/* Title & Location */}
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                  {property.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-5 h-5 text-indigo-500" /> 
                    {property.location?.area}, {property.location?.city}
                  </span>
                  <span className="hidden md:block text-gray-300">|</span>
                  <span className="capitalize px-3 py-1 bg-gray-100 rounded-lg text-sm font-bold text-gray-800">
                    {property.type}
                  </span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-8 border-b border-gray-200">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                       <Users className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Capacity</p>
                       <p className="text-lg font-bold text-gray-900">{property.capacity?.total || 0} Guests</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                       <BedDouble className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bedrooms</p>
                       <p className="text-lg font-bold text-gray-900">{property.bedrooms || 0}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                       <Bath className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Baths</p>
                       <p className="text-lg font-bold text-gray-900">{property.bathrooms || 0}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Security</p>
                       <p className="text-lg font-bold text-gray-900">Verified</p>
                    </div>
                 </div>
              </div>

              {/* Description */}
              <div>
                 <h3 className="text-xl font-black text-gray-900 mb-4">About this space</h3>
                 <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                    {property.description}
                 </p>
              </div>

              {/* Amenities */}
              <div>
                 <h3 className="text-xl font-black text-gray-900 mb-6">What this place offers</h3>
                 <div className="grid grid-cols-2 gap-y-4">
                    {property.amenities?.map((amenity, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-600">
                         <div className="w-6 h-6 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-500" />
                         </div>
                         <span className="font-semibold text-gray-700">{amenity}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* House Rules */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                 <h3 className="text-xl font-black text-gray-900 mb-6">House Rules</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                          <span className="text-gray-500 font-semibold">Check-in</span>
                          <span className="text-gray-900 font-bold">{property.checkIn || '13:00'}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-gray-500 font-semibold">Check-out</span>
                          <span className="text-gray-900 font-bold">{property.checkOut || '11:00'}</span>
                       </div>
                    </div>
                    <div className="p-4 bg-orange-50/50 rounded-2xl flex items-start gap-3">
                       <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                       <p className="text-xs text-orange-800 font-medium">
                          Please treat this home with respect. Standard rules regarding smoking and pets apply as per the owner's policy.
                       </p>
                    </div>
                 </div>
              </div>

           </div>

           {/* Right: Booking Card / Owner Info */}
           <div className="space-y-8">
              
              {/* Booking Sticky Card */}
              <div className="sticky top-28 bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl shadow-indigo-100">
                 <div className="flex items-end gap-2 mb-6">
                    <span className="text-3xl font-black text-gray-900">₹{property.price?.perNight}</span>
                    <span className="text-gray-500 font-semibold text-sm mb-1">/ night</span>
                 </div>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <Calendar className="w-5 h-5 text-gray-400" />
                       <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select Dates</p>
                          <p className="text-sm font-bold text-gray-900">Check availability</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <Users className="w-5 h-5 text-gray-400" />
                       <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Guests</p>
                          <p className="text-sm font-bold text-gray-900">Up to {property.capacity?.total} guests</p>
                       </div>
                    </div>
                 </div>

                 <button 
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 translate-y-0 hover:-translate-y-1"
                  onClick={() => {}}
                 >
                    Reserve Now
                 </button>
                 <p className="text-center text-xs text-gray-400 mt-4 font-bold">You won't be charged yet</p>
              </div>

              {/* Owner Info Card */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Coordinated by</h4>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-100">
                       {property.owner?.name?.charAt(0) || 'O'}
                    </div>
                    <div>
                       <p className="text-lg font-black text-gray-900">{property.owner?.name || 'Lonavala Host'}</p>
                       <p className="text-xs text-gray-500 font-bold">Premier Partner</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600 group cursor-pointer">
                       <Mail className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" /> 
                       <span className="font-semibold group-hover:text-indigo-600 transition-colors">{property.owner?.email || 'Contact through platform'}</span>
                    </div>
                    {property.owner?.phone && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-indigo-500" /> {property.owner.phone}
                      </div>
                    )}
                 </div>
                 <div className="mt-6 pt-6 border-t border-gray-50 text-center">
                    <button className="text-indigo-600 font-black text-xs hover:underline decoration-2">Report Listing</button>
                 </div>
              </div>

           </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
