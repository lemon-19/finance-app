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
  TrendingUp
} from "lucide-react";
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
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-lg h-screen flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header - Logo + Brand */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Wallet size={24} className="text-white" />
              </div>
              {/* Brand Name */}
              <div>
                <h2 className="text-xl font-bold text-gray-800">Finance App</h2>
                <p className="text-xs text-gray-500">Manage Your Money</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
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

        {/* Footer - Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
          
          {/* Optional: Version or additional info */}
          <div className="mt-3 px-3">
            <p className="text-xs text-gray-400 text-center">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
}