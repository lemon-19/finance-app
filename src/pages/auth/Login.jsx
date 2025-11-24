import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // <-- import icons
import { loginUser, signInWithGoogle } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { addExpenseType } from "../../api/userCategories/expenseTypes";
import { addBillCategory } from "../../api/userCategories/billCategories";
import { addIncomeType } from "../../api/userCategories/incomeTypes";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const db = getFirestore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- toggle state

  const setupDefaultCategories = async (uid) => {
    const defaultExpenses = ["Snacks", "Transport", "Grocery", "Entertainment"];
    const defaultBills = ["Subscription", "Utilities", "Mobile/Telecom", "Loan"];
    const defaultIncome = ["Salary", "Freelance", "Gift", "Loan"];

    for (const cat of defaultExpenses) await addExpenseType(uid, cat);
    for (const cat of defaultBills) await addBillCategory(uid, cat);
    for (const cat of defaultIncome) await addIncomeType(uid, cat);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      setUser(user);
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          createdAt: new Date(),
        });
        await setupDefaultCategories(user.uid);
      }

      setUser(user);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-50 to-green-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 sm:p-10 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Login to access your dashboard</p>
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

{/* Password Input with Eye Toggle */}
<div className="flex flex-col gap-1 relative">
  <label className="text-gray-700 font-medium text-sm">Password</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
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


        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 border border-gray-300 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
            <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.4h147c-6.4 34.5-25.8 63.7-55 83.2v68h88.9c52.2-48 82.6-118.7 82.6-196.2z"/>
            <path fill="#34A853" d="M272 544.3c74.2 0 136.5-24.7 182-66.7l-88.9-68c-24.7 16.6-56.1 26.3-93.1 26.3-71.6 0-132.2-48.3-153.8-113.1H27v70.7C72.1 485.1 167 544.3 272 544.3z"/>
            <path fill="#FBBC05" d="M118.2 325.5c-5.4-16.2-8.5-33.6-8.5-51.5s3.1-35.3 8.5-51.5V152.3H27C9.6 187.5 0 223.8 0 261s9.6 73.5 27 108.7l91.2-44.2z"/>
            <path fill="#EA4335" d="M272 107.4c38.7 0 73.2 13.3 100.5 39.3l75.3-75.3C408.4 24.8 346.1 0 272 0 167 0 72.1 59.2 27 152.3l91.2 70.7c21.6-64.8 82.2-113.1 153.8-113.1z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
