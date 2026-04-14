import { createContext, useContext, useState } from "react";

type User = {
  name: string;
  role: "owner" | "manager" | "cashier";
};

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  // 🔥 TEMP: hardcode user (later from API/login)
  const [user, setUser] = useState<User>({
    name: "Admin",
    role: "owner",
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);