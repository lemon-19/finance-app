import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
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

  // Default categories for new users
  const setupDefaultCategories = async (uid) => {
    const defaultExpenses = ["Snacks", "Transport", "Grocery", "Entertainment"];
    const defaultBills = ["Subscription", "Utilities", "Mobile/Telecom", "Loan"];
    const defaultIncome = ["Salary", "Freelance", "Gift", "Loan"];

    for (const cat of defaultExpenses) await addExpenseType(uid, cat);
    for (const cat of defaultBills) await addBillCategory(uid, cat);
    for (const cat of defaultIncome) await addIncomeType(uid, cat);
  };

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      setUser(user);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // New user: create Firestore document and default categories
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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5">Login</h2>

        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button onClick={handleLogin} className="w-full mt-3">Login</Button>

        <Button
          onClick={handleGoogleSignIn}
          className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
        >
          Sign in with Google
        </Button>

        <p className="mt-3 text-sm text-gray-500">
          Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}
