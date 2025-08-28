import { apiClient } from "@/lib/api-client";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/types";

export async function getTasks(): Promise<Task[]> {
  return apiClient.get<Task[]>("/tasks");
}

export async function getTask(id: string): Promise<Task> {
  return apiClient.get<Task>(`/tasks/${id}`);
}

export async function createTask(
  data: CreateTaskInput,
  isRetry: boolean = false
): Promise<Task> {
  let order = data.order;
  if (order === undefined) {
    const allTasks = await getTasks();
    const targetStatus = data.status || "todo";
    const tasksInStatus = allTasks.filter(
      (task) => task.status === targetStatus
    );
    order =
      tasksInStatus.length > 0
        ? Math.max(...tasksInStatus.map((t) => t.order)) + 1
        : 0;
  }

  const taskData = {
    ...data,
    status: data.status || "todo",
    order,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return apiClient.post<Task>("/tasks", taskData, isRetry);
}

export async function updateTask(
  id: string,
  data: UpdateTaskInput,
  isRetry: boolean = false
): Promise<Task> {
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  const res = await apiClient.patch<Task>(`/tasks/${id}`, updateData, isRetry);
  return res;
}

export async function deleteTask(id: string): Promise<void> {
  return apiClient.delete<void>(`/tasks/${id}`);
}

export async function reorderTasks(
  updates: Array<{ id: string; order: number }>
): Promise<Task[]> {
  const updatePromises = updates.map(({ id, order }) =>
    updateTask(id, { order })
  );
  return Promise.all(updatePromises);
}
