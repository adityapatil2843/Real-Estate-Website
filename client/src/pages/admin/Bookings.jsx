import React, { useContext, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Badge } from "../../components/admin/Badge";
import { Download } from "lucide-react";
import { AppContent } from "../../context/AppContext";

const Bookings = () => {
  const { adminBookings, getAdminBookings, processAdminPayout } = useContext(AppContent);

  useEffect(() => {
    getAdminBookings();
  }, []);

  const actionButton = (
    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition">
      <Download className="w-4 h-4 mr-2" />
      Export Bookings
    </button>
  );

  return (
    <AdminLayout title="Bookings Details" actionButton={actionButton}>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">All Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Booking ID</th>
                <th className="px-6 py-3 font-medium">Property Name</th>
                <th className="px-6 py-3 font-medium">Tourist Name</th>
                <th className="px-6 py-3 font-medium">Dates</th>
                <th className="px-6 py-3 font-medium">Total Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Payout / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {adminBookings && adminBookings.length > 0 ? adminBookings.map((booking, i) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{booking._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-600">{booking.property?.title || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600">{booking.tourist?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(booking.checkInDate || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">₹{(booking.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <Badge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {booking.payoutStatus === "Pending" ? (
                      <button 
                        onClick={() => processAdminPayout(booking._id)}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition">
                        Release Payout
                      </button>
                    ) : booking.payoutStatus ? (
                      <span className="text-gray-500 font-medium text-xs capitalize">{booking.payoutStatus}</span>
                    ) : (
                      <span className="text-gray-400 font-medium text-xs italic">N/A</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="p-4 text-center text-gray-500">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Bookings;
