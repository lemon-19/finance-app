import { Menu, User } from "lucide-react";

export default function Navbar({ toggleSidebar, userName }) {
  return (
    <nav className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-10 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <span className="font-bold text-lg md:text-xl">Finance App</span>
      </div>

      <div className="flex items-center gap-3">
        {/* User icon for mobile, full greeting for desktop */}
        <div className="flex items-center gap-2">
          <User size={20} className="text-gray-600 md:hidden" />
          <span className="hidden md:block text-gray-700">
            {userName ? `Hello, ${userName}` : "Hello, User"}
          </span>
          <span className="md:hidden text-sm text-gray-700 max-w-[120px] truncate">
            {userName || "User"}
          </span>
        </div>
      </div>
    </nav>
  );
}