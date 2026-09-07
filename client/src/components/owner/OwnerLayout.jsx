import React from "react";
import { Outlet, useLocation, NavLink, Link } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import { AppContent } from "../../context/AppContext";
import { useContext } from "react";

const OwnerLayout = () => {
  const location = useLocation();
  const { userData } = useContext(AppContent);

  const navLinks = [
    { name: "Dashboard", href: "/owner" },
    { name: "My Properties", href: "/owner/properties" },
    { name: "Bookings", href: "/owner/bookings" },
    { name: "Reviews", href: "/owner/reviews" },
    { name: "Earnings", href: "/owner/earnings" },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/owner" || path === "/owner/") return "Owner Dashboard";
    if (path.includes("/owner/properties/add")) return "Add New Property";
    if (path.includes("/owner/properties")) return "My Properties";
    if (path.includes("/owner/bookings")) return "Bookings Management";
    if (path.includes("/owner/reviews")) return "Host Reviews";
    if (path.includes("/owner/earnings")) return "Earnings & Payouts";
    return "Owner Interface";
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* Sidebar */}
      <div className="w-[220px] shrink-0 bg-white border-r border-gray-200 flex flex-col h-full inset-y-0 left-0 fixed">
        <div className="px-6 py-8 border-b border-gray-100 text-center">
          <h2 className="text-xl font-bold text-gray-800">{userData ? userData.name : "Loading..."}</h2>
          <span className="inline-block mt-2 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Owner
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || (link.href !== "/owner" && location.pathname.startsWith(link.href));

              return (
                <li key={link.name}>
                  <NavLink
                    to={link.href}
                    className={`block pl-6 py-3 text-sm font-medium transition-colors ${isActive
                      ? "text-indigo-600 bg-indigo-50/50 border-l-4 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                      }`}
                  >
                    {link.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 shrink-0">
          <Link to="/" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 hover:bg-gray-100 rounded-md">
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Exit Owner
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[220px] h-full overflow-hidden shrink-0 block">
        {/* Topbar */}
        <header className="h-[76px] bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0 shadow-sm z-10 block">
          <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>

          <Link
            to="/owner/properties/add"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Property
          </Link>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 overflow-y-auto p-8 block bg-gray-50">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default OwnerLayout;
