import { create } from "zustand";

interface User {
  name: string;
  role: "owner" | "manager" | "cashier";
}

interface AuthState {
  user: User | null;
  setUser: (u: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: {
    name: "Admin",
    role: "owner", // 🔥 change to test roles
  },

  setUser: (u) => set({ user: u }),
  logout: () => set({ user: null }),
}));