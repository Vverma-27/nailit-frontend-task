import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask } from "@/api/tasks";
import { QUERY_KEYS } from "@/lib/constants";
import { useOfflineStore } from "@/stores/offline-store";
import { useOfflineQueue } from "@/hooks/use-offline-queue";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/types";
import { API_ERROR_CODES, ApiError } from "@/lib/api-client";

export function useTasks() {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS,
    queryFn: getTasks,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { isOnline, setOnlineStatus } = useOfflineStore();
  const { queueAction } = useOfflineQueue();

  return useMutation({
    mutationFn: isOnline ? createTask : () => Promise.resolve(null),
    networkMode: "always",
    onMutate: async (newTask: CreateTaskInput) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });

      const previousTasks =
        queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS) || [];

      const targetStatus = newTask.status || "todo";
      const tasksInStatus = previousTasks.filter(
        (task) => task.status === targetStatus
      );
      const nextOrder =
        tasksInStatus.length > 0
          ? Math.max(...tasksInStatus.map((task) => task.order)) + 1
          : 0;

      const optimisticTask: Task = {
        ...newTask,
        status: targetStatus,
        order: nextOrder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => [
        ...(old || []),
        optimisticTask,
      ]);

      if (!isOnline) {
        queueAction("CREATE", optimisticTask.id, newTask);
      }

      return { previousTasks, optimisticTask, newTask };
    },
    retry: false,
    onError: (err, __, context) => {
      if (err instanceof ApiError) {
        if ((err.code = API_ERROR_CODES.NETWORK_ERROR)) {
          setOnlineStatus(false);
          queueAction("CREATE", context?.optimisticTask.id, context?.newTask);
        }
        return;
      }
      if (isOnline && context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
      }
    },
    onSuccess: (createdTask, __, context) => {
      // Replace optimistic task with real task from server (only when online)
      if (isOnline && context?.optimisticTask) {
        queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) =>
          (old || []).map((task) =>
            task.id === context.optimisticTask.id ? createdTask! : task
          )
        );
      }
    },
    // Don't invalidate on settled to avoid unnecessary refetching
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { isOnline, setOnlineStatus } = useOfflineStore();
  const { queueAction } = useOfflineQueue();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      updateTask(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });

      // Queue for offline if needed
      if (!isOnline) {
        queueAction("UPDATE", id, data);
      }

      return { taskId: id, taskData: data };
    },
    retry: false,
    // Note: onError handling is done at the component level for drag operations
    onSuccess: (updatedTask, __, ___) => {
      // Update with the server response to ensure consistency while maintaining order
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
        if (!old) return [updatedTask];

        const taskIndex = old.findIndex((task) => task.id === updatedTask.id);
        if (taskIndex === -1) return [...old, updatedTask];

        // Replace the task at its current position to maintain order
        const newTasks = [...old];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
      });
    },
    onError: (err, _, context) => {
      if (err instanceof ApiError) {
        if ((err.code = API_ERROR_CODES.NETWORK_ERROR)) {
          setOnlineStatus(false);
          queueAction("UPDATE", context?.taskId, context?.taskData);
        }
      }
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { isOnline, setOnlineStatus } = useOfflineStore();
  const { queueAction } = useOfflineQueue();

  return useMutation({
    mutationFn: deleteTask,
    retry: false,
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);

      // Optimistically remove the task
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) =>
        (old || []).filter((task) => task.id !== id)
      );

      // Queue for offline if needed
      if (!isOnline) {
        queueAction("DELETE", id);
      }

      return { previousTasks, deletedTaskId: id };
    },
    onError: (err, _, context) => {
      if (err instanceof ApiError) {
        if ((err.code = API_ERROR_CODES.NETWORK_ERROR)) {
          setOnlineStatus(false);
          queueAction("DELETE", context?.deletedTaskId);
        }
        return;
      }
      // Revert the optimistic update on error
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
      }
    },
  });
}
