import React, { useContext, useEffect, useState } from "react";
import StatusBadge from "../../components/owner/StatusBadge";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const OwnerProperties = () => {
  const { backendUri } = useContext(AppContent);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUri}/api/owner/properties`, { withCredentials: true });
      if (res.data.success) {
        setProperties(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const formatMoney = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  };

  const handleEdit = (id) => {
    // TODO: Redirect to edit page
    console.log(`Edit property: ${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const res = await axios.delete(`${backendUri}/api/owner/properties/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Property deleted successfully");
        fetchProperties();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete property");
    }
  };

  const handleVerify = async (id) => {
    try {
      const res = await axios.put(`${backendUri}/api/owner/properties/${id}`, { status: "pending" }, { withCredentials: true });
      if (res.data.success) {
        toast.info("Property submitted for verification!");
        fetchProperties();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification request failed");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading Properties...</div>;

  return (
    <div className="space-y-6">
      {properties.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border border-dashed border-gray-300">
           <p className="text-gray-500">You haven't added any properties yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div key={prop._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gray-100 h-40 w-full flex items-center justify-center border-b border-gray-200 shrink-0 overflow-hidden relative">
                {prop.images && prop.images.length > 0 ? (
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 text-sm italic">No Image</span>
                )}
                <div className="absolute top-2 right-2">
                  <StatusBadge status={prop.status} />
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{prop.title}</h3>
                </div>
                
                <p className="text-sm text-gray-500 mb-4 capitalize">{prop.type} • {prop.location?.area || "Lonavala"}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm bg-gray-50 p-3 rounded-md">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Price/Night</p>
                    <p className="font-semibold text-gray-900">{formatMoney(prop.price?.perNight)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Capacity</p>
                    <p className="font-semibold text-gray-900">{prop.capacity?.total || prop.maxGuests} Guests</p>
                  </div>
                </div>

                <div className="flex text-sm text-gray-600 space-x-4 mb-6">
                  <span><span className="font-semibold text-gray-800">{prop.bedrooms || 0}</span> BR</span>
                  <span><span className="font-semibold text-gray-800">{prop.bathrooms || 0}</span> Bath</span>
                  {prop.video && <span className="text-indigo-600 font-medium">📺 Video</span>}
                </div>
                
                <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => window.open(`/property/${prop._id}`, '_blank')}
                    className="bg-white text-indigo-600 border border-indigo-200 py-1.5 rounded text-xs font-bold hover:bg-indigo-50 transition shadow-sm uppercase tracking-tighter"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleEdit(prop._id)}
                    className="bg-white text-amber-600 border border-amber-200 py-1.5 rounded text-xs font-bold hover:bg-amber-50 transition shadow-sm uppercase tracking-tighter"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleVerify(prop._id)}
                    disabled={prop.status !== 'unpublished' && prop.status !== 'rejected'}
                    className={`py-1.5 rounded text-xs font-bold transition shadow-sm uppercase tracking-tighter border ${
                      prop.status === 'pending' || prop.status === 'live'
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {prop.status === 'pending' ? 'Verifying' : 'Verify'}
                  </button>
                </div>
                <button 
                    onClick={() => handleDelete(prop._id)}
                    className="mt-3 w-full text-center text-xs text-red-400 hover:text-red-600 transition underline"
                  >
                    Delete Property
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerProperties;
