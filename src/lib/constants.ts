export const QUERY_KEYS = {
  TASKS: ["tasks"] as const,
  TASK: (id: string) => ["tasks", id] as const,
} as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const STORAGE_KEYS = {
  AUTH_TOKEN: "sprint-board-token",
  DARK_MODE: "sprint-board-dark-mode",
  OFFLINE_QUEUE: "sprint-board-offline-queue",
} as const;

export const TASK_STATUSES = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
} as const;

export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const TASK_PRIORITIES_LIST = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export const COLUMN_CONFIG = [
  {
    id: TASK_STATUSES.TODO,
    title: "Todo",
    color: "bg-slate-100 dark:bg-slate-800",
  },
  {
    id: TASK_STATUSES.IN_PROGRESS,
    title: "In Progress",
    color: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    id: TASK_STATUSES.DONE,
    title: "Done",
    color: "bg-green-100 dark:bg-green-900/20",
  },
] as const;
