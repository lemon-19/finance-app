import { useNavigate } from "react-router-dom";
import { DollarSign, CreditCard, FileText, Wallet } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-tr from-blue-50 to-green-50 flex flex-col">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center shadow-md">
            <Wallet size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Finance App</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 lg:px-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-10">
          Take Control of Your Finances
        </h2>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mb-8 mt-8">
          Track your income, expenses, and bills easily. Plan your budget and save smarter. Designed for Filipinos who want financial freedom.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-linear-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold"
          >
            Login
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition">
          <div className="p-4 bg-blue-50 rounded-xl mb-4">
            <DollarSign size={28} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Track Income</h3>
          <p className="text-gray-500 text-sm">Easily log your salary, freelance, or other income sources.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition">
          <div className="p-4 bg-red-50 rounded-xl mb-4">
            <CreditCard size={28} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Manage Expenses</h3>
          <p className="text-gray-500 text-sm">Track your daily spending and see which categories cost you most.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition">
          <div className="p-4 bg-orange-50 rounded-xl mb-4">
            <FileText size={28} className="text-orange-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Stay on Top of Bills</h3>
          <p className="text-gray-500 text-sm">Get reminders for upcoming bills and never miss a due date again.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-blue-500 to-green-500 py-16 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to take control?</h3>
        <p className="mb-8 max-w-xl mx-auto text-lg">
          Join hundreds of Filipinos managing their finances smarter and easier every day.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:scale-105 transform transition"
        >
          Start Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Finance App. All rights reserved.
      </footer>
    </div>
  );
}
