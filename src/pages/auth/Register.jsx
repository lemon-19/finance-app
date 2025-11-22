// src/pages/auth/Register.jsx
import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const db = getFirestore();
  const { setUser } = useAuth(); // update AuthContext
  const navigate = useNavigate();

const handleRegister = async () => {
  if (!name || !email || !password) return alert("Please fill all fields");

  setLoading(true);
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name in Auth
    await updateProfile(userCredential.user, { displayName: name });
    await auth.currentUser.reload();

    // Save user info in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name: name,
      email: email,
      createdAt: new Date()
    });

    // Update context so navbar sees it
    setUser(auth.currentUser);

    alert("Registration successful!");
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5">Register</h2>
        <Input
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          onClick={handleRegister}
          className="w-full mt-3"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </div>
    </div>
  );
}
