import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";
import type { AuthState } from "@/types";

interface AuthStore extends AuthState {
  setAuth: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      setAuth: (token: string) =>
        set({
          isAuthenticated: true,
          token,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          token: null,
        }),
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);
