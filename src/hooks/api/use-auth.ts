import { useMutation } from "@tanstack/react-query";
import { login, logout } from "@/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { STORAGE_KEYS } from "@/lib/constants";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      setAuth(response.token);
    },
  });
}

export function useLogout() {
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      logoutStore();
    },
  });
}
