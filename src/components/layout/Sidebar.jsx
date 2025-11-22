import { NavLink, useNavigate } from "react-router-dom";
import { Home, CreditCard, DollarSign, FileText, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

export default function Sidebar() {
  const { setUser } = useAuth(); // AuthContext setter
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
      await signOut(auth); // Firebase sign out
      setUser(null);       // Update AuthContext
      navigate("/login");  // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Try again.");
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen p-5 hidden md:block">
      <h2 className="text-2xl font-bold mb-8">Finance App</h2>
      <ul>
        {links.map((link) => (
          <li key={link.name} className="mb-4">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded hover:bg-blue-100 ${
                  isActive ? "bg-blue-200 font-semibold text-blue-700" : "text-gray-700"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 mt-10 text-red-600 hover:text-red-800"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}
