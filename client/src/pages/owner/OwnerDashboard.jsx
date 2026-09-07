import React, { useContext, useEffect, useState } from "react";
import StatCard from "../../components/owner/StatCard";
import StatusBadge from "../../components/owner/StatusBadge";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const OwnerDashboard = () => {
  const { backendUri } = useContext(AppContent);
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await axios.get(`${backendUri}/api/owner/dashboard`, { withCredentials: true });
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // Fetch bookings (using same endpoint or separate one if needed)
      // For dashboard we just need the most recent ones
      const bookingsRes = await axios.get(`${backendUri}/api/owner/bookings`, { withCredentials: true });
      if (bookingsRes.data.success) {
        // Filter for pending or just show latest 5
        const pendingOnly = bookingsRes.data.data.filter(b => b.status === "pending" || b.status === "Pending");
        setRecentBookings(pendingOnly.slice(0, 5));
      }
    } catch (error) {
      console.error("Dashboard Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatMoney = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${backendUri}/api/owner/bookings/${id}/status`, { status });
      if (res.data.success) {
        toast.success(`Booking ${status}`);
        fetchDashboardData(); // Refresh
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Properties" value={stats?.totalPropertiesCount || 0} />
        <StatCard label="Total Bookings" value={stats?.totalBookingsCount || 0} />
        <StatCard label="Pending Approval" value={stats?.pendingBookingsCount || 0} sub="Requires Action" />
        <StatCard label="Total Earned" value={formatMoney(stats?.totalEarnings)} />
        <StatCard label="Pending Payout" value={formatMoney(stats?.pendingPayoutAmount)} />
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Bookings (Action Required)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Property</th>
                <th className="px-6 py-3 font-medium">Tourist</th>
                <th className="px-6 py-3 font-medium">Dates</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.length > 0 ? recentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{b.property?.title}</td>
                  <td className="px-6 py-4 text-gray-600">{b.tourist?.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{formatMoney(b.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {(b.status === "pending" || b.status === "Pending") && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(b._id, "confirmed")}
                          className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded hover:bg-green-100 transition font-medium text-xs whitespace-nowrap"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(b._id, "cancelled")}
                          className="bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-200 transition font-medium text-xs whitespace-nowrap"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">No pending bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
