import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ userData, onVerify, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showMenu = isOpen || isHovered;

  return (
    <div 
      className="relative cursor-pointer" 
      ref={menuRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-white text-black font-semibold border transition hover:shadow-md ${showMenu ? 'ring-2 ring-gray-300' : ''}`}>
        {userData?.name?.[0]?.toUpperCase()}
      </div>

      {showMenu && (
        <div className="absolute right-0 mt-2 z-50 animate-fadeIn fade-in">
          <ul className="bg-white shadow-xl rounded-lg text-sm py-2 w-48 border border-gray-100 text-black overflow-hidden relative">
            
            <li className="px-4 flex flex-col py-2 border-b border-gray-100 mb-1 cursor-default">
               <span className="font-semibold text-gray-800 truncate">{userData?.name}</span>
               <span className="text-xs text-gray-500 capitalize">{userData?.role || 'Tourist'}</span>
            </li>

            {userData?.role === "owner" && (
                <li
                  onClick={() => navigate('/owner')}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 transition"
                >
                  Dashboard
                </li>
            )}
            {userData?.role === "admin" && (
                <li
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 transition"
                >
                  Admin Panel
                </li>
            )}

            {!userData?.isAccountVerified && (
              <li
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onVerify(); 
                  setIsOpen(false); 
                }}
                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-indigo-600 font-medium transition"
              >
                Verify Email
              </li>
            )}

            <li
              onClick={(e) => { 
                e.stopPropagation(); 
                onLogout(); 
                setIsOpen(false); 
              }}
              className="px-4 py-2 hover:bg-red-50 cursor-pointer text-red-600 font-medium transition mt-1"
            >
               Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
