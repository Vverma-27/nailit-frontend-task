import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";
import type { AppState, TaskPriority } from "@/types";

interface AppStore extends AppState {
  setDarkMode: (darkMode: boolean) => void;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: TaskPriority | "all") => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      darkMode: false,
      searchQuery: "",
      priorityFilter: "all",
      setDarkMode: (darkMode: boolean) => set({ darkMode }),
      setSearchQuery: (searchQuery: string) => set({ searchQuery }),
      setPriorityFilter: (priorityFilter: TaskPriority | "all") =>
        set({ priorityFilter }),
    }),
    {
      name: STORAGE_KEYS.DARK_MODE,
      partialize: (state) => ({
        darkMode: state.darkMode,
      }),
    }
  )
);
