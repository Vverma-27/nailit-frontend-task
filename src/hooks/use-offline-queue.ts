import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOfflineStore } from "@/stores/offline-store";
import { offlineQueueService } from "@/lib/offline-queue-service";
import { QUERY_KEYS } from "@/lib/constants";

export function useOfflineQueue() {
  const { isOnline, queue } = useOfflineStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Auto-process queue when coming online
    if (isOnline && queue.length > 0) {
      const processQueue = async () => {
        await offlineQueueService.processQueue(queryClient);
        // No need to invalidate since we're directly updating the cache
      };

      // Small delay to ensure connection is stable
      const timeoutId = setTimeout(processQueue, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isOnline, queue.length, queryClient]);

  const queueAction = (
    type: "CREATE" | "UPDATE" | "DELETE",
    taskId?: string,
    data?: any
  ) => {
    return offlineQueueService.queueAction(type, taskId, data);
  };

  return {
    isOnline,
    queue,
    queuedCount: queue.length,
    queueAction,
  };
}
