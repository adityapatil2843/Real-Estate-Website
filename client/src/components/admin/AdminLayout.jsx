import React from "react";
import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { useMockAuth } from "../../context/MockAuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  CalendarCheck, 
  UserCheck, 
  Wallet, 
  MessageSquare,
  LogOut
} from "lucide-react";

export const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useMockAuth();
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children ? children : <Outlet />;
};

const AdminLayout = ({ children, title = "Dashboard", actionButton = null }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Owners", href: "/admin/owners", icon: UserCheck },
    { name: "Listings", href: "/admin/listings", icon: Home },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { name: "Tourists", href: "/admin/tourists", icon: Users },
    { name: "Payments", href: "/admin/payments", icon: Wallet },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar - Fixed 220px wide */}
      <div className="w-[220px] shadow-sm bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0">
        <div className="flex items-center justify-center py-6 border-b border-gray-200 shrink-0">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">StayLonavala</h1>
          <span className="text-xs text-blue-600 font-semibold align-top ml-1 mt-[-10px]">ADMIN</span>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200 shrink-0">
          <Link to="/" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 hover:bg-gray-100 rounded-md">
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Exit Admin
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-[220px] flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0 shadow-sm z-10 block">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <div>
            {actionButton}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 block">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
