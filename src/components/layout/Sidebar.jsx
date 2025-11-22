import { NavLink, useNavigate } from "react-router-dom";
import { Home, CreditCard, DollarSign, FileText, Settings, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

export default function Sidebar({ isOpen, onClose }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();

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
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Try again.");
    }
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-lg h-screen p-5 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header with close button for mobile */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Finance App</h2>
          <button
            onClick={onClose}
            className="md:hidden text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <ul>
          {links.map((link) => (
            <li key={link.name} className="mb-4">
              <NavLink
                to={link.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 transition-colors ${
                    isActive
                      ? "bg-blue-200 font-semibold text-blue-700"
                      : "text-gray-700"
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 mt-10 p-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </>
  );
}