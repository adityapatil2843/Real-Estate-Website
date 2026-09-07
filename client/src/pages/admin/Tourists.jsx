import React, { useContext, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Badge } from "../../components/admin/Badge";
import { Search } from "lucide-react";
import { AppContent } from "../../context/AppContext";

const Tourists = () => {
  const { adminTourists, getAdminTourists, updateAdminTouristStatus } = useContext(AppContent);

  useEffect(() => {
    getAdminTourists();
  }, []);

  const actionButton = (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
        placeholder="Search tourists..."
      />
    </div>
  );

  return (
    <AdminLayout title="Tourist Database" actionButton={actionButton}>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">All Registered Tourists</h3>
          <span className="text-sm text-gray-500">Total: {adminTourists?.length || 0}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Tourist Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {adminTourists && adminTourists.length > 0 ? adminTourists.map((tourist, i) => (
                <tr key={tourist._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{tourist.name}</td>
                  <td className="px-6 py-4 text-gray-600">{tourist.email}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(tourist.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge status={tourist.status || "active"} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">View</button>
                    {tourist.status === "flagged" ? (
                      <button 
                        onClick={() => updateAdminTouristStatus(tourist._id, "verified")}
                        className="text-amber-600 hover:text-amber-800 font-medium text-xs">Unflag</button>
                    ) : (
                      <button 
                        onClick={() => updateAdminTouristStatus(tourist._id, "suspended")}
                        className="text-red-600 hover:text-red-800 font-medium text-xs">Block</button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No tourists found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Tourists;
