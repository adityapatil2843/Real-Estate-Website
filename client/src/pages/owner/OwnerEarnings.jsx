import React, { useState, useEffect, useContext } from "react";
import StatusBadge from "../../components/owner/StatusBadge";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const OwnerEarnings = () => {
  const { backendUri } = useContext(AppContent);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUri}/api/owner/earnings`);
      if (res.data.success) {
        setEarnings(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
      toast.error("Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const formatMoney = (amount) => `₹${(amount || 0).toLocaleString('en-IN')}`;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "Awaiting release";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading Earnings...</div>;

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Earned (All Time)</p>
          <p className="text-4xl font-bold text-gray-800">{formatMoney(earnings?.totalEarned)}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-6 border border-amber-100 shadow-sm">
          <p className="text-sm font-medium text-amber-700 uppercase tracking-wider mb-2">Pending Payout</p>
          <p className="text-4xl font-bold text-amber-600">{formatMoney(earnings?.pendingPayout)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 border border-green-100 shadow-sm">
          <p className="text-sm font-medium text-green-700 uppercase tracking-wider mb-2">Released (Cleared)</p>
          <p className="text-4xl font-bold text-green-600">{formatMoney((earnings?.totalEarned || 0) - (earnings?.pendingPayout || 0))}</p>
        </div>
      </div>

      {/* Payout Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Payouts (Released)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Property</th>
                <th className="px-6 py-3 font-medium">Booking ID</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {earnings?.recentPayouts && earnings.recentPayouts.length > 0 ? earnings.recentPayouts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.property?.title || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-500">{p._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{formatMoney(p.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.payoutStatus || "released"} />
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No released payouts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50/50 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            Note: Payouts are released by admin within 2 days of guest checkout.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerEarnings;
