import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "@/types";

interface AuthStore extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      login: (token: string) => set({ isAuthenticated: true, token }),
      logout: () => set({ isAuthenticated: false, token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
