"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/api/tasks";
import { TaskColumn } from "./task-column";
import { Task } from "@/types";

export function SprintBoard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAllTasks,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error loading tasks</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn
          title="To Do"
          status="todo"
          tasks={tasks}
          onTaskClick={setSelectedTask}
        />
        <TaskColumn
          title="In Progress"
          status="in-progress"
          tasks={tasks}
          onTaskClick={setSelectedTask}
        />
        <TaskColumn
          title="Done"
          status="done"
          tasks={tasks}
          onTaskClick={setSelectedTask}
        />
      </div>
    </div>
  );
}
