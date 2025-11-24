import { Menu, Bell, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom"; // <-- import Link

export default function Navbar({ toggleSidebar, userName }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6 lg:px-8 sticky top-0 z-30">
      
      {/* Left Section */}
      <div className="flex items-center">
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative hidden sm:block" aria-label="Notifications">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-800">{userName || "User"}</span>
              <span className="text-xs text-gray-500">Account</span>
            </div>
            <ChevronDown size={16} className="text-gray-600 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{userName || "User"}</p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>

              {/* Use Link for navigation */}
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowUserMenu(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowUserMenu(false)}
              >
                Settings
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  // Handle logout if you want
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <span className="md:hidden text-sm text-gray-700 max-w-[100px] truncate">{userName || "User"}</span>
      </div>
    </nav>
  );
}
