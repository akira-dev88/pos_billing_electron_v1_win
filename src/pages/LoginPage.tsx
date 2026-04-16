import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../renderer/services/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await apiPost("/login", { email, password });

      if (!res.token) {
        alert("Invalid login");
        return;
      }

      const user = res?.data?.user;

      if (!user) {
        alert("User data missing");
        return;
      }

      login(res.token, user);

      navigate("/pos");
    } catch (e) {
      console.error(e);
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80 space-y-3">
        <h1 className="text-lg font-bold">Login</h1>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}