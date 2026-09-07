import React, { useContext, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Badge } from "../../components/admin/Badge";
import { Plus } from "lucide-react";
import { AppContent } from "../../context/AppContext";

const Owners = () => {
  const { adminOwners, getAdminOwners, updateAdminOwnerStatus } = useContext(AppContent);

  useEffect(() => {
    getAdminOwners();
  }, []);

  // Filter owners based on their account status
  const pendingApprovals = adminOwners?.filter(o => o.status === "pending") || [];
  const approvedOwners = adminOwners?.filter(o => o.status === "verified" || o.status === "active") || [];
  const unapprovedOwners = adminOwners?.filter(o => o.status === "suspended" || o.status === "rejected") || [];

  const actionButton = (
    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition shadow-sm">
      <Plus className="w-4 h-4 mr-2" />
      Onboard Owner
    </button>
  );

  return (
    <AdminLayout title="Property Owners Management" actionButton={actionButton}>
      
      {/* Pending Approvals Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900">Pending Approvals</h3>
            <p className="text-xs text-gray-500 mt-1">Owners awaiting account verification</p>
          </div>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
            {pendingApprovals.length} Pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Owner Profile</th>
                <th className="px-6 py-4 font-semibold">Joined Details</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingApprovals.length > 0 ? pendingApprovals.map((owner, i) => (
                <tr key={owner._id || i} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{owner.name || "Unnamed Owner"}</span>
                      <span className="text-gray-500 text-xs">{owner.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600">{new Date(owner.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status="Pending" />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => updateAdminOwnerStatus(owner._id, "verified")}
                      className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 font-medium text-xs transition"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateAdminOwnerStatus(owner._id, "rejected")}
                      className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 font-medium text-xs transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <p className="font-medium">No pending owner approvals</p>
                      <p className="text-xs text-gray-400 mt-1">New owners will appear here after registration</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verified Owners Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900">Verified & Active Owners</h3>
            <p className="text-xs text-gray-500 mt-1">Owners with full platform access</p>
          </div>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            {approvedOwners.length} Active
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Owner Profile</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {approvedOwners.length > 0 ? approvedOwners.map((owner, i) => (
                <tr key={owner._id || i} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{owner.name || "Unnamed Owner"}</span>
                      <span className="text-gray-500 text-xs">{owner.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(owner.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status="Active" variant="success" />
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs transition underline-offset-4 hover:underline">View Portfolio</button>
                    <button 
                      onClick={() => updateAdminOwnerStatus(owner._id, "suspended")}
                      className="text-red-600 hover:text-red-800 font-semibold text-xs transition underline-offset-4 hover:underline"
                    >
                      Suspend
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500 font-medium">No verified owners found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unapproved / Suspended Owners Section */}
      {unapprovedOwners.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-red-700">Flagged / Restricted Owners</h3>
            <p className="text-xs text-gray-500 mt-1">Owners who are suspended or whose applications were rejected</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Owner Profile</th>
                  <th className="px-6 py-4 font-semibold">Reason / Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {unapprovedOwners.map((owner, i) => (
                  <tr key={owner._id || i} className="hover:bg-red-50/30 transition opacity-80">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{owner.name}</span>
                        <span className="text-gray-500 text-xs">{owner.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Last update: {new Date(owner.updatedAt || owner.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={owner.status} variant="danger" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => updateAdminOwnerStatus(owner._id, "pending")}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs transition"
                      >
                        Reinstate to Pending
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Owners;
