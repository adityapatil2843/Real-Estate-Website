import React, { useState, useEffect, useContext } from "react";
import StatusBadge from "../../components/owner/StatusBadge";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const OwnerBookings = () => {
  const { backendUri } = useContext(AppContent);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUri}/api/owner/bookings`);
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatMoney = (amount) => `₹${(amount || 0).toLocaleString('en-IN')}`;
  
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${backendUri}/api/owner/bookings/${id}/status`, { status });
      if (res.data.success) {
        toast.success(`Booking ${status}`);
        fetchBookings(); // Refresh
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "All") return true;
    return b.status?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading Bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200">
        {["All", "Pending", "Confirmed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab 
                ? "border-indigo-500 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Property</th>
                <th className="px-6 py-3 font-medium">Tourist</th>
                <th className="px-6 py-3 font-medium">Check-In / Check-Out</th>
                <th className="px-6 py-3 font-medium text-center">Nights</th>
                <th className="px-6 py-3 font-medium text-center">Guests</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length > 0 ? filteredBookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{b.property?.title}</td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 font-medium">{b.tourist?.name}</p>
                    <p className="text-gray-500 text-xs">{b.tourist?.phone || "No Phone"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{formatDate(b.checkIn)}</p>
                    <p className="text-gray-500 text-xs">to {formatDate(b.checkOut)}</p>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600 border-l border-gray-100">{b.nights || 0}</td>
                  <td className="px-6 py-4 text-center text-gray-600 border-r border-gray-100">{b.guests || 0}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{formatMoney(b.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {(b.status === "pending" || b.status === "Pending") && (
                      <>
                        <button onClick={() => handleUpdateStatus(b._id, "confirmed")} className="text-green-600 hover:text-green-800 font-medium text-xs">Confirm</button>
                        <button onClick={() => handleUpdateStatus(b._id, "cancelled")} className="text-gray-500 hover:text-gray-700 font-medium text-xs">Decline</button>
                      </>
                    )}
                    {!(b.status === "pending" || b.status === "Pending") && (
                      <span className="text-xs text-gray-400 italic">No actions needed</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500 bg-gray-50/50">
                    No bookings found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerBookings;
