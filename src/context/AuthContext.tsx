import { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "../renderer/services/api";

type User = {
  name: string;
  role: "owner" | "manager" | "cashier";
  email?: string;
};

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 INIT AUTH (runs once on app load)
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await apiGet("/me");

        // ✅ FIX: correct data extraction
        const userData = res?.data?.user;

        if (!userData) {
          throw new Error("Invalid user response");
        }

        setUser(userData);
      } catch (e) {
        console.error("Auth failed", e);

        // ❌ Token invalid → force logout
        localStorage.removeItem("token");
        setUser(null);
      }

      setLoading(false);
    };

    init();
  }, []);

  // ✅ LOGIN
  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);