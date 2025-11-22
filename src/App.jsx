// src/App.jsx
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"} overflow-hidden`}>
            <Sidebar />
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            <Navbar toggleSidebar={toggleSidebar} userName={user?.displayName} />

            <main className="flex-1 overflow-y-auto bg-gray-100">
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
