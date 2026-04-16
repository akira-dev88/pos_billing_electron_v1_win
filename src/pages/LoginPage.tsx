// src/pages/LoginPage.tsx

import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../renderer/services/authApi";
import { useAuth } from "../auth/useAuth";

export default function LoginPage() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Enter email & password");
            return;
        }

        setLoading(true);

        try {
            const res = await login(email, password);

            if (!res.token || !res.user) {
                alert("Invalid credentials");
                return;
            }

            setAuth(res.user, res.token);

            navigate("/admin/dashboard");
        } catch (e) {
            console.error(e);
            alert("Login failed");
        }

        setLoading(false);
    };

    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/admin/dashboard");
        }
    }, [user]);

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow w-[350px] space-y-4">

                <h1 className="text-xl font-bold text-center">
                    Login
                </h1>

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
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </div>
        </div>
    );
}