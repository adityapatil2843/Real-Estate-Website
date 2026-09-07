import React from "react";

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const s = status.toLowerCase();
  
  let colorClass = "bg-gray-100 text-gray-800";
  
  if (["pending"].includes(s)) {
    colorClass = "bg-yellow-100 text-yellow-800";
  } else if (["confirmed", "live", "verified"].includes(s)) {
    colorClass = "bg-green-100 text-green-800";
  } else if (["cancelled", "rejected", "removed"].includes(s)) {
    colorClass = "bg-red-100 text-red-800";
  } else if (["released"].includes(s)) {
    colorClass = "bg-blue-100 text-blue-800";
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} capitalize inline-block text-center whitespace-nowrap`}>
      {status}
    </span>
  );
};

export default StatusBadge;
