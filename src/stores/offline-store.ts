import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  generateId,
  isOnline as isOnlineAsync,
  isOnlineSync,
} from "@/lib/utils";
import type {
  OfflineState,
  QueuedAction,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/types";

interface OfflineStore extends OfflineState {
  setOnlineStatus: (isOnline: boolean) => void;
  queueAction: (
    type: QueuedAction["type"],
    taskId?: string,
    data?: CreateTaskInput | UpdateTaskInput
  ) => string;
  removeFromQueue: (actionId: string) => void;
  clearQueue: () => void;
  getQueuedTaskIds: () => string[];
  checkOnlineStatus: () => Promise<void>;
}

export const useOfflineStore = create<OfflineStore>()(
  persist(
    (set, get) => ({
      isOnline: isOnlineSync(),
      checkOnlineStatus: async () => {
        const isOnline = await isOnlineAsync();
        set({ isOnline });
      },
      queue: [],
      setOnlineStatus: (isOnline: boolean) => set({ isOnline }),
      queueAction: (type, taskId, data) => {
        const actionId = generateId();
        const action: QueuedAction = {
          id: actionId,
          type,
          taskId,
          data,
          timestamp: Date.now(),
        };
        set((state) => ({
          queue: [...state.queue, action],
        }));
        return actionId;
      },
      removeFromQueue: (actionId: string) =>
        set((state) => ({
          queue: state.queue.filter((action) => action.id !== actionId),
        })),
      clearQueue: () => set({ queue: [] }),
      getQueuedTaskIds: () => {
        const state = get();
        return state.queue
          .filter((action) => action.taskId)
          .map((action) => action.taskId!);
      },
    }),
    {
      name: STORAGE_KEYS.OFFLINE_QUEUE,
      partialize: (state) => ({
        queue: state.queue,
      }),
    }
  )
);

if (typeof window !== "undefined") {
  setInterval(() => {
    useOfflineStore.getState().checkOnlineStatus();
  }, 3000);
}
