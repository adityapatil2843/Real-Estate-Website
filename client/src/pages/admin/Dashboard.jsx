import React, { useContext, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Badge } from "../../components/admin/Badge";
import { Download } from "lucide-react";
import { AppContent } from "../../context/AppContext";

const Dashboard = () => {
  const { adminMetrics, getAdminMetrics, adminBookings, getAdminBookings } = useContext(AppContent);

  useEffect(() => {
    getAdminMetrics();
    getAdminBookings();
  }, []);

  const metrics = [
    { label: "Total Bookings", value: adminMetrics?.totalBookings || 0 },
    { label: "Platform Revenue", value: `₹${(adminMetrics?.platformRevenue || 0).toLocaleString('en-IN')}` },
    { label: "Active Listings", value: adminMetrics?.activeListings || 0 },
    { label: "Pending Approvals", value: adminMetrics?.pendingApprovals || 0 },
  ];

  // Derive recent activity from bookings (just getting last 5)
  const recentActivity = adminBookings?.slice(-5).reverse().map(b => ({
    id: b._id.slice(-6).toUpperCase(),
    user: b.tourist?.name || "Unknown User",
    action: `Booked '${b.property?.title || "Property"}'`,
    time: new Date(b.createdAt || Date.now()).toLocaleDateString(),
    status: b.status === "pending" ? "Pending" : b.status === "confirmed" ? "Confirmed" : "Cancelled"
  })) || [];

  // Dynamically calculate top areas from recent bookings
  const calculateTopAreas = () => {
    if (!adminBookings || adminBookings.length === 0) return [];
    
    const areaCounts = {};
    adminBookings.forEach(b => {
      const area = b.property?.location?.area;
      if (area) {
        areaCounts[area] = (areaCounts[area] || 0) + 1;
      }
    });
    
    return Object.entries(areaCounts)
      .map(([area, bookings]) => ({ area, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 4);
  };
  
  const topAreas = calculateTopAreas();

  // Derive booking status mechanically
  const confirmedCount = adminBookings?.filter(b => b.status === "confirmed")?.length || 0;
  const pendingCount = adminBookings?.filter(b => b.status === "pending")?.length || 0;
  const cancelledCount = adminBookings?.filter(b => b.status === "cancelled")?.length || 0;
  const totalCount = adminBookings?.length || 1; // prevent divide by zero

  const bookingStatus = [
    { status: "Confirmed", count: Math.round((confirmedCount / totalCount) * 100) },
    { status: "Pending", count: Math.round((pendingCount / totalCount) * 100) },
    { status: "Cancelled", count: Math.round((cancelledCount / totalCount) * 100) },
  ];

  const actionButton = (
    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition">
      <Download className="w-4 h-4 mr-2" />
      Export Report
    </button>
  );

  return (
    <AdminLayout title="Overview Dashboard" actionButton={actionButton}>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">{m.label}</p>
            <h3 className="text-2xl font-bold text-gray-800">{m.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">Ref ID</th>
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                    <th className="px-6 py-3 font-medium">Time</th>
                    <th className="px-6 py-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentActivity.length > 0 ? recentActivity.map((act, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{act.id}</td>
                      <td className="px-6 py-4 text-gray-600">{act.user}</td>
                      <td className="px-6 py-4 text-gray-600">{act.action}</td>
                      <td className="px-6 py-4 text-gray-500">{act.time}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge status={act.status} />
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="p-4 text-center text-gray-500">No activity yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Top Areas */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Top Areas</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-gray-100">
                  {topAreas.map((area, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-800 font-medium">{area.area}</td>
                      <td className="px-6 py-3 text-gray-500 text-right">{area.bookings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Booking Split */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Booking Status</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-gray-100">
                  {bookingStatus.map((stat, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <Badge status={stat.status} />
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-right">{stat.count} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
