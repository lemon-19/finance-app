import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Default category imports
import { addExpenseType } from "../../api/userCategories/expenseTypes";
import { addBillCategory } from "../../api/userCategories/billCategories";
import { addIncomeType } from "../../api/userCategories/incomeTypes";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const db = getFirestore();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const setupDefaultCategories = async (uid) => {
    const defaultExpenses = ["Snacks", "Transport", "Grocery", "Entertainment"];
    const defaultBills = ["Subscription", "Utilities", "Mobile/Telecom", "Loan"];
    const defaultIncome = ["Salary", "Freelance", "Gift", "Loan"];

    for (const cat of defaultExpenses) await addExpenseType(uid, cat);
    for (const cat of defaultBills) await addBillCategory(uid, cat);
    for (const cat of defaultIncome) await addIncomeType(uid, cat);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return alert("Please fill all fields");

    setLoading(true);
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(userCredential.user, { displayName: name });
      await auth.currentUser.reload();

      // Save to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        createdAt: new Date(),
      });

      // Add default categories
      await setupDefaultCategories(userCredential.user.uid);

      // Update context
      setUser(auth.currentUser);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-50 to-green-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 sm:p-10 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm">Sign up to start tracking your finances</p>
        </div>

        {/* Name Input */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium text-sm">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-gray-700 font-medium text-sm">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Already have an account */}
        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
