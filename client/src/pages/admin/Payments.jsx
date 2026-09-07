import React, { useContext, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { CreditCard } from "lucide-react";
import { AppContent } from "../../context/AppContext";

const Payments = () => {
  const { adminBookings, getAdminBookings } = useContext(AppContent);

  useEffect(() => {
    getAdminBookings();
  }, []);

  // Filter bookings to find those awaiting payout
  // Payout is pending if status = "confirmed" and payoutStatus is empty or "pending"
  const pendingPayouts = adminBookings?.filter(b => b.status === "confirmed" && (!b.payoutStatus || b.payoutStatus === "pending")) || [];

  const refundRequests = adminBookings?.filter(b => b.status === "cancelled" && b.payoutStatus !== "refunded") || [];

  const totalCollected = adminBookings?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0;
  
  // Fake commission logic: 20%
  const platformEarnings = totalCollected * 0.20;
  const totalSent = adminBookings?.filter(b => b.payoutStatus === "released").reduce((sum, b) => sum + (b.totalAmount || 0) * 0.80, 0) || 0;

  const actionButton = (
    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition">
      <CreditCard className="w-4 h-4 mr-2" />
      Bank Settings
    </button>
  );

  return (
    <AdminLayout title="Financial Overview" actionButton={actionButton}>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Collected (All Time)</p>
          <h3 className="text-2xl font-bold text-gray-800">₹{totalCollected.toLocaleString('en-IN')}</h3>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Payouts Sent to Owners</p>
          <h3 className="text-2xl font-bold text-gray-800">₹{totalSent.toLocaleString('en-IN')}</h3>
        </div>
        <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm bg-blue-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard className="w-16 h-16 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-blue-800 mb-1">Platform Earnings (20% Comm.)</p>
          <h3 className="text-2xl font-bold text-blue-900">₹{platformEarnings.toLocaleString('en-IN')}</h3>
        </div>
      </div>

      {/* Pending Payouts Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Pending Payouts to Owners (After Checkout)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Owner</th>
                <th className="px-6 py-3 font-medium">Booking ID</th>
                <th className="px-6 py-3 font-medium">Amount Due</th>
                <th className="px-6 py-3 font-medium">Checkout Date</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingPayouts.map((payout, i) => (
                <tr key={payout._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{payout.property?.owner?.name || "Unknown Owner"}</td>
                  <td className="px-6 py-4 text-gray-600">{payout._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">₹{((payout.totalAmount || 0) * 0.8).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(payout.checkOutDate || Date.now()).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition font-medium text-xs">
                      Release Payout
                    </button>
                  </td>
                </tr>
              ))}
              {pendingPayouts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No pending payouts at the moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Refund Requests (Cancelled Bookings)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Tourist</th>
                <th className="px-6 py-3 font-medium">Booking ID</th>
                <th className="px-6 py-3 font-medium">Reason for Cancellation</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {refundRequests.map((refund, i) => (
                <tr key={refund._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{refund.tourist?.name || "Unknown"}</td>
                  <td className="px-6 py-4 text-gray-600">{refund._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-600">Pending Review</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">₹{(refund.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded hover:bg-green-100 transition font-medium text-xs">
                      Process Refund
                    </button>
                    <button className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded hover:bg-red-100 transition font-medium text-xs">
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
              {refundRequests.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No active refund requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </AdminLayout>
  );
};

export default Payments;
