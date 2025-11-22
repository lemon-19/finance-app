import { Menu } from "lucide-react";

export default function Navbar({ toggleSidebar, userName }) {
  return (
    <nav className="h-16 bg-white shadow flex items-center justify-between px-5 md:px-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <span className="font-bold text-lg">Finance App</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Show user name if available */}
        <span className="hidden md:block">
          {userName ? `Hello, ${userName}` : "Hello, User"}
        </span>
      </div>
    </nav>
  );
}
