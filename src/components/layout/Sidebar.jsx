import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  CreditCard,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  X,
  Wallet,
  TrendingUp,
  Menu,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // mobile sidebar state

  const links = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/" },
    { name: "Expenses", icon: <CreditCard size={20} />, path: "/expenses" },
    { name: "Income", icon: <DollarSign size={20} />, path: "/income" },
    { name: "Bills", icon: <FileText size={20} />, path: "/bills" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
      setIsOpen(false); // close sidebar after logout
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Try again.");
    }
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-lg h-screen flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Wallet size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Finance App</h2>
                <p className="text-xs text-gray-500">Manage Your Money</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? "text-blue-600" : "text-gray-500"}>
                        {link.icon}
                      </span>
                      {link.name}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
          <div className="mt-3 px-3">
            <p className="text-xs text-gray-400 text-center">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
