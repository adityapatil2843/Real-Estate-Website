export const Badge = ({ status, variant }) => {
  let colorClass = "bg-gray-100 text-gray-700 border-gray-200";
  
  const lowerStatus = status?.toLowerCase() || "";
  
  // Status-based defaults
  if (variant === "success" || ["approved", "confirmed", "verified", "active", "live"].includes(lowerStatus)) {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (variant === "warning" || ["pending", "awaiting approval", "not_submitted"].includes(lowerStatus)) {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (variant === "danger" || ["rejected", "cancelled", "suspended", "flagged"].includes(lowerStatus)) {
    colorClass = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (variant === "info" || ["processing", "under review"].includes(lowerStatus)) {
    colorClass = "bg-sky-50 text-sky-700 border-sky-200";
  }

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-md border ${colorClass} capitalize shadow-sm transition-all animate-in fade-in duration-300`}>
      {status?.replace("_", " ")}
    </span>
  );
};
