"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { tasksApi } from "@/api/tasks";
import { TaskColumn } from "./task-column";
import { TaskCard } from "@/components/task/task-card";
import { Task, TaskStatus } from "@/types";
import { toast } from "sonner";

export function SprintBoard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAllTasks,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      tasksApi.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    updateTaskMutation.mutate({
      id: taskId,
      updates: { status: newStatus },
    });
  };

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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
      
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
