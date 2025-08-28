"use client";

import { Task, TaskPriority } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">{task.title}</h3>
          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2 truncat">
              {task.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span
              className={`inline-block px-2 py-1 text-xs rounded border ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(task.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
