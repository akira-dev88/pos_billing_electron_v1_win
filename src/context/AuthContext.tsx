import { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  role: "owner" | "manager" | "cashier";
};

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // optionally decode token or fetch user
      setUser({
        name: "Admin",
        role: "owner",
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);