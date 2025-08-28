import { useOfflineStore } from "@/stores/offline-store";
import { createTask, updateTask, deleteTask } from "@/api/tasks";
import { generateId } from "./utils";
import { QUERY_KEYS } from "./constants";
import type { QueryClient } from "@tanstack/react-query";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  QueuedAction,
  Task,
} from "@/types";

class OfflineQueueService {
  private isProcessing = false;

  async processQueue(queryClient?: QueryClient) {
    if (this.isProcessing) return;

    const { queue, removeFromQueue, isOnline } = useOfflineStore.getState();

    if (!isOnline || queue.length === 0) return;

    this.isProcessing = true;

    // Process queue items one by one
    for (const action of queue) {
      try {
        await this.processAction(action, queryClient);
        removeFromQueue(action.id);
      } catch (error) {
        console.error(`Failed to process queue action ${action.id}:`, error);
        // Stop processing on first error to maintain order
        break;
      }
    }

    this.isProcessing = false;
  }

  private async processAction(action: QueuedAction, queryClient?: QueryClient) {
    switch (action.type) {
      case "CREATE":
        if (action.data && action.taskId) {
          // Create the task on the server
          const serverTask = await createTask(action.data as CreateTaskInput);

          // If we have queryClient, replace the temp task with the server task
          if (queryClient) {
            queryClient.setQueryData<Task[]>(
              QUERY_KEYS.TASKS,
              (old: Task[] | undefined) => {
                if (!old) return [serverTask];

                // Replace temp task with server task
                return old.map((task) =>
                  task.id === action.taskId ? serverTask : task
                );
              }
            );
          }
        }
        break;
      case "UPDATE":
        if (action.taskId && action.data) {
          await updateTask(action.taskId, action.data as UpdateTaskInput);
        }
        break;
      case "DELETE":
        if (action.taskId) {
          await deleteTask(action.taskId);
        }
        break;
    }
  }

  queueAction(
    type: QueuedAction["type"],
    taskId?: string,
    data?: CreateTaskInput | UpdateTaskInput
  ): string {
    const { queueAction } = useOfflineStore.getState();
    return queueAction(type, taskId, data);
  }

  async replayWhenOnline(queryClient?: QueryClient) {
    const { isOnline } = useOfflineStore.getState();
    if (isOnline) {
      await this.processQueue(queryClient);
    }
  }
}

export const offlineQueueService = new OfflineQueueService();

// Note: Queue processing is handled by useOfflineQueue hook
// which has access to the React Query client
