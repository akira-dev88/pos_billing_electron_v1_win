import { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "../renderer/services/api";

type User = {
  name: string;
  role: "owner" | "manager" | "cashier";
};

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 INIT AUTH
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
        setUser(res.user || res); // 🔥 FIXED
      } catch (e) {
        localStorage.removeItem("token");
        setUser(null);
      }

      setLoading(false);
    };

    init();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

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