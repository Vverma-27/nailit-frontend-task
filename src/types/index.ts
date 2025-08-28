export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  status?: TaskStatus;
  order?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  order?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export interface QueuedAction {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE";
  taskId?: string;
  data?: CreateTaskInput | UpdateTaskInput;
  timestamp: number;
}

export interface OfflineState {
  isOnline: boolean;
  queue: QueuedAction[];
}

export interface AppState {
  darkMode: boolean;
  searchQuery: string;
  priorityFilter: TaskPriority | "all";
}
