import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import Expenses from "./pages/expenses/Expenses";
import Income from "./pages/income/Income";
import Bills from "./pages/bills/Bills";
import Debts from "./pages/debts/Debts";
import Settings from "./pages/settings/Settings";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Extract user name from user object
  const userName = user?.displayName || user?.email?.split("@")[0] || "";

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        // Unauthenticated Routes
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        // Authenticated Layout
        <div className="flex h-screen overflow-hidden bg-gray-50">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navbar */}
            <Navbar toggleSidebar={toggleSidebar} userName={userName} />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/income" element={<Income />} />
                <Route path="/bills" element={<Bills />} />
                <Route path="/debts" element={<Debts />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;