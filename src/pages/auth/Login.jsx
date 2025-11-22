import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigate("/");
    } catch (err) {
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
        <p className="mt-3 text-sm text-gray-500">Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/register")}>Register</span></p>
      </div>
    </div>
  );
}
