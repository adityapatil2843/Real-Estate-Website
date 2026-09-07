import React, { useContext, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Badge } from "../../components/admin/Badge";
import { Filter } from "lucide-react";
import { AppContent } from "../../context/AppContext";

const Reviews = () => {
  const { adminReviews, getAdminReviews, moderateAdminReview } = useContext(AppContent);

  useEffect(() => {
    getAdminReviews();
  }, []);

  const flaggedReviews = adminReviews?.filter(r => r.status === "Flagged" || r.status === "flagged") || [];
  const recentReviews = adminReviews?.filter(r => r.status !== "Flagged" && r.status !== "flagged") || [];

  const actionButton = (
    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition">
      <Filter className="w-4 h-4 mr-2" />
      Filter Reviews
    </button>
  );

  const renderStars = (rating) => {
    return (
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "" : "text-gray-300"}>★</span>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout title="Reviews & Moderation" actionButton={actionButton}>
      
      {/* Flagged Reviews */}
      <div className="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-red-200 bg-red-50 flex items-center justify-between">
          <h3 className="font-semibold text-red-800 focus:outline-none">Action Required: Flagged Reviews</h3>
          <span className="bg-red-200 text-red-900 text-xs font-bold px-2 py-1 rounded-full">{flaggedReviews.length} Pending</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Tourist</th>
                <th className="px-6 py-3 font-medium">Property</th>
                <th className="px-6 py-3 font-medium">Rating</th>
                <th className="px-6 py-3 font-medium">Review Snippet</th>
                <th className="px-6 py-3 font-medium text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {flaggedReviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{review.tourist?.name || "Unknown"}</td>
                  <td className="px-6 py-4 text-gray-600">{review.property?.title || "N/A"}</td>
                  <td className="px-6 py-4 text-lg">{renderStars(review.rating || 1)}</td>
                  <td className="px-6 py-4 text-gray-600 italic">"{review.comment}"</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-200 transition font-medium text-xs">
                      Read Full
                    </button>
                    <button 
                      onClick={() => moderateAdminReview(review._id, "Removed")}
                      className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded hover:bg-red-100 transition font-medium text-xs">
                      Remove
                    </button>
                    <button 
                      onClick={() => moderateAdminReview(review._id, "Live")}
                      className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded hover:bg-green-100 transition font-medium text-xs">
                      Keep
                    </button>
                  </td>
                </tr>
              ))}
              {flaggedReviews.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No flagged reviews needing moderation!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Recent Reviews Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">All Recent Reviews</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Tourist</th>
                <th className="px-6 py-3 font-medium">Property</th>
                <th className="px-6 py-3 font-medium">Stars</th>
                <th className="px-6 py-3 font-medium">Date Given</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentReviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{review.tourist?.name || "Unknown"}</td>
                  <td className="px-6 py-4 text-gray-600">{review.property?.title || "N/A"}</td>
                  <td className="px-6 py-4 text-lg">{renderStars(review.rating || 5)}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge status={review.status || "Live"} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs underline">
                      View details
                    </button>
                  </td>
                </tr>
              ))}
              {recentReviews.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No recent reviews yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </AdminLayout>
  );
};

export default Reviews;
