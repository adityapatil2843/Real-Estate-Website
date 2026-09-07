import React, { useContext, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Badge } from "../../components/admin/Badge";
import { Plus, X, User, Home, MapPin, Users, Check, AlertCircle, Info, Phone, Mail } from "lucide-react";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Listings = () => {
  const { adminListings, getAdminListings, getAdminListingDetails, updateAdminListingStatus } = useContext(AppContent);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    getAdminListings();
  }, []);

  const handleOpenPreview = async (id) => {
    setLoadingPreview(true);
    const data = await getAdminListingDetails(id);
    if (data) {
      setPreviewData(data);
      setShowPreview(true);
    }
    setLoadingPreview(false);
  };

  const awaitingApproval = adminListings?.filter(item => item.status === "pending" || item.status === "Pending") || [];
  const liveListings = adminListings?.filter(item => item.status === "live" || item.status === "Live") || [];

  const actionButton = (
    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition">
      <Plus className="w-4 h-4 mr-2" />
      Add Listing
    </button>
  );

  return (
    <AdminLayout title="Properties & Listings" actionButton={actionButton}>

      {/* Awaiting Approval Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Awaiting Approval</h3>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">{awaitingApproval.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Property Name</th>
                <th className="px-6 py-3 font-medium">Owner</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Price/Night</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {awaitingApproval.length > 0 ? awaitingApproval.map((item, i) => (
                <tr key={item._id || i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-gray-600">{item.owner?.name || "Unknown"}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{item.type}</td>
                  <td className="px-6 py-4 text-gray-600">₹{item.price?.perNight || 0}</td>
                  <td className="px-6 py-4">
                    <Badge status="pending" />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleOpenPreview(item._id)}
                      disabled={loadingPreview}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-xs disabled:opacity-50">
                      {loadingPreview ? "..." : "Preview"}
                    </button>
                    <button
                      onClick={() => updateAdminListingStatus(item._id, "live")}
                      className="text-green-600 hover:text-green-800 font-medium text-xs">Publish</button>
                    <button
                      onClick={() => updateAdminListingStatus(item._id, "rejected")}
                      className="text-red-600 hover:text-red-800 font-medium text-xs">Reject</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No properties awaiting approval.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Listings Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Live Listings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Property Name</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Price/Night</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {liveListings.length > 0 ? liveListings.map((item, i) => (
                <tr key={item._id || i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{item.type}</td>
                  <td className="px-6 py-4 text-gray-600">{item.location?.city || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600">₹{item.price?.perNight || 0}</td>
                  <td className="px-6 py-4">
                    <Badge status="live" />
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</button>
                    <button
                      onClick={() => updateAdminListingStatus(item._id, "unpublished")}
                      className="text-red-600 hover:text-red-800 font-medium text-xs">Unpublish</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No live listings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Preview Modal */}
      <AnimatePresence>
        {showPreview && previewData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{previewData.property.title}</h2>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Badge status={previewData.property.status} />
                    <span className="mx-2">•</span>
                    <span className="capitalize">{previewData.property.type}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {previewData.property.location.area}, {previewData.property.location.city}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Details & Media */}
                  <div className="lg:col-span-2 space-y-8">
                    
                    {/* Media Gallery */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Property Media</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {previewData.property.images && previewData.property.images.slice(0, 4).map((img, idx) => (
                          <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-gray-200 shadow-sm border border-white">
                            <img src={img} alt="Property" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      {previewData.property.video && (
                        <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                           <video src={previewData.property.video} controls className="w-full h-full" />
                        </div>
                      )}
                    </div>

                    {/* Property Specs */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                         <Info className="w-5 h-5 mr-2 text-blue-500" /> Property Specifications
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <p className="text-xs text-blue-600 font-semibold mb-1">Pricing</p>
                          <p className="text-lg font-bold text-gray-900">₹{previewData.property.price.perNight}</p>
                          <p className="text-[10px] text-blue-400">per night</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl">
                          <p className="text-xs text-purple-600 font-semibold mb-1">Capacity</p>
                          <p className="text-lg font-bold text-gray-900">{previewData.property.capacity.total}</p>
                          <p className="text-[10px] text-purple-400">Total Guests</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl">
                          <p className="text-xs text-green-600 font-semibold mb-1">Bedrooms</p>
                          <p className="text-lg font-bold text-gray-900">{previewData.property.bedrooms || 0}</p>
                          <p className="text-[10px] text-green-400">Private rooms</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-xl">
                          <p className="text-xs text-orange-600 font-semibold mb-1">Status</p>
                          <p className="text-lg font-bold text-gray-900 capitalize">{previewData.property.status}</p>
                          <p className="text-[10px] text-orange-400">Current Phase</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-50">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{previewData.property.description}</p>
                      </div>
                    </div>

                    {/* Amenities / Rules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {previewData.property.amenities.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center">
                               <Check className="w-3 h-3 mr-1 text-green-500" /> {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">House Rules</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Check-In</span>
                            <span className="font-semibold text-gray-900">{previewData.property.checkIn || "13:00"}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Check-Out</span>
                            <span className="font-semibold text-gray-900">{previewData.property.checkOut || "11:00"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Owner Info & Portfolio */}
                  <div className="space-y-8">
                    
                    {/* Owner Profile Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-br from-white to-gray-50">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Property Owner</h3>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold">
                          {previewData.property.owner?.name?.charAt(0) || "O"}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">{previewData.property.owner?.name}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-0.5 capitalize">
                            <Badge status={previewData.property.owner?.status || "Verified"} />
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-600">
                           <Mail className="w-4 h-4 mr-3 text-gray-400" /> {previewData.property.owner?.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                           <Phone className="w-4 h-4 mr-3 text-gray-400" /> {previewData.property.owner?.phone || "No phone listed"}
                        </div>
                      </div>
                    </div>

                    {/* Other Properties */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                       <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Owner's Portfolio</h3>
                       <div className="space-y-4">
                         {previewData.otherProperties.length > 0 ? previewData.otherProperties.map((p, i) => (
                           <div key={i} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition group">
                             <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <Home className="w-6 h-6 m-3 text-gray-400 group-hover:text-indigo-500 transition" />
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className="text-sm font-bold text-gray-900 truncate">{p.title}</p>
                               <p className="text-[10px] text-gray-500 flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" /> {p.location.area}
                               </p>
                             </div>
                             <Badge status={p.status} />
                           </div>
                         )) : (
                           <p className="text-xs text-gray-400 italic py-4 text-center">No other properties found.</p>
                         )}
                       </div>
                    </div>

                    {/* Alert / Verification Help */}
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex items-start space-x-3">
                       <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                       <div>
                         <h5 className="text-xs font-bold text-yellow-800">Verification Note</h5>
                         <p className="text-[10px] text-yellow-700 mt-1">Please verify that images are real and the price is competitive before publishing.</p>
                       </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center sticky bottom-0 z-10">
                <button 
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Close Preview
                </button>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                        updateAdminListingStatus(previewData.property._id, "rejected");
                        setShowPreview(false);
                    }}
                    className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-bold text-sm transition shadow-sm"
                  >
                    Reject Property
                  </button>
                  <button 
                    onClick={() => {
                        updateAdminListingStatus(previewData.property._id, "live");
                        setShowPreview(false);
                    }}
                    className="px-8 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-sm transition shadow-md shadow-indigo-100"
                  >
                    Publish Listing
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AdminLayout>
  );
};

export default Listings;
