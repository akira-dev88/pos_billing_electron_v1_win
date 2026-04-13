import { useState } from "react";
import { login } from "./renderer/services/authApi";

function App() {
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("123456");

  const handleLogin = async () => {
    const res = await login(email, password);
    console.log(res);

    if (res.token) {
      alert("Login success ✅");
    } else {
      alert("Login failed ❌");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 border rounded w-80 space-y-3">
        <h1 className="text-xl font-bold">Login</h1>

        <input
          className="w-full p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full p-2 bg-blue-500 text-white"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default App;