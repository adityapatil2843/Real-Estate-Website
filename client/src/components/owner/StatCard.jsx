import React from "react";

export const StatCard = ({ label, value, sub }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-5 flex flex-col justify-center border border-gray-100 shadow-sm">
      <span className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
        {label}
      </span>
      <span className="text-3xl font-bold text-gray-800 tracking-tight">
        {value}
      </span>
      {sub && (
        <span className="text-xs font-semibold mt-2 text-indigo-600">
          {sub}
        </span>
      )}
    </div>
  );
};

export default StatCard;
