import React, { useState, useEffect, useContext } from "react";
import StatusBadge from "../../components/owner/StatusBadge";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const OwnerReviews = () => {
  const { backendUri } = useContext(AppContent);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUri}/api/owner/reviews`);
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex text-amber-400 tracking-widest text-lg">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "" : "text-gray-200"}>★</span>
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading Reviews...</div>;

  return (
    <div className="max-w-4xl max-w-full space-y-6">
      
      {reviews.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3 text-indigo-800">
            <span className="text-3xl font-bold">{calculateAverageRating()}</span>
            <div>
                <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(calculateAverageRating()) ? "" : "text-indigo-200"}>★</span>
                    ))}
                </div>
                <p className="text-sm font-medium opacity-80">Average rating across {reviews.length} reviews</p>
            </div>
            </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? reviews.map((r) => (
          <div key={r._id} className={`bg-white border rounded-lg p-5 shadow-sm relative overflow-hidden ${r.status === 'flagged' ? 'border-red-200' : 'border-gray-200'}`}>
            {r.status === 'flagged' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></div>}
            
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-gray-900">{r.tourist?.name || "Guest"}</p>
                <p className="text-xs text-gray-500">Stayed at <span className="font-medium text-gray-700">{r.property?.title}</span></p>
              </div>
              <div className="text-right">
                <StatusBadge status={r.status || "published"} />
                <p className="text-xs text-gray-400 mt-1">{formatDate(r.createdAt)}</p>
              </div>
            </div>
            
            <div className="mb-2">
              {renderStars(r.rating)}
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed italic">"{r.comment}"</p>
          </div>
        )) : (
            <div className="text-center py-12 text-gray-500 italic">No reviews found yet.</div>
        )}
      </div>

    </div>
  );
};

export default OwnerReviews;
