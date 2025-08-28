"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { TaskColumn } from "@/components/board/task-column";
import { EditableTaskCard } from "@/components/task/editable-task-card";
import { CreateTaskModal } from "@/components/task/create-task-modal";
import { useTasks, useUpdateTask } from "@/hooks/api/use-tasks";
import { useAppStore } from "@/stores/app-store";
import { COLUMN_CONFIG, QUERY_KEYS } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Task, TaskStatus } from "@/types";
import { useOfflineStore } from "@/stores/offline-store";

export function SprintBoard() {
  const { isOnline } = useOfflineStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [draggedOverContainer, setDraggedOverContainer] = useState<
    string | null
  >(null);
  const { data: tasks, isLoading, error } = useTasks();
  const { searchQuery, priorityFilter } = useAppStore();
  const { mutate: updateTaskMutation, isPending: isUpdatingTask } =
    useUpdateTask();
  const queryClient = useQueryClient();

  const filteredTasks = useMemo(() => {
    const defaultTasks: Record<TaskStatus, Task[]> = {
      todo: [],
      "in-progress": [],
      done: [],
    };

    if (!tasks) return defaultTasks;

    const filtered = tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;
        return matchesSearch && matchesPriority;
      })
      .reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
      }, defaultTasks);

    // Sort tasks within each column by order
    Object.keys(filtered).forEach((status) => {
      filtered[status as TaskStatus].sort((a, b) => a.order - b.order);
    });

    return filtered;
  }, [tasks, searchQuery, priorityFilter]);

  const handleDragStart = (event: DragStartEvent) => {
    if (!isOnline) return;

    const { active } = event;
    const task = tasks?.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);

      // Remove the task from its current position immediately when drag starts
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
        if (!old) return [];
        return old.filter((t) => t.id !== active.id);
      });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!isOnline) return;

    const { over } = event;

    if (!over) {
      setDraggedOverContainer(null);
      return;
    }

    const overId = over.id as string;
    const validStatuses = COLUMN_CONFIG.map((col) => col.id);

    // If dropped on a column, use that column
    if (validStatuses.includes(overId as TaskStatus)) {
      setDraggedOverContainer(overId);
    } else {
      // If dropped on a task, find which column that task belongs to
      const targetTask = tasks?.find((task) => task.id === overId);
      if (targetTask) {
        setDraggedOverContainer(targetTask.status);
      } else {
        setDraggedOverContainer(null);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!isOnline) return;

    const { active, over } = event;
    const taskId = active.id as string;
    const draggedTask = activeTask;

    setActiveTask(null);
    setDraggedOverContainer(null);

    if (!draggedTask) return;

    // If dropped outside any valid drop zone, revert to original position
    if (!over) {
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
        if (!old) return [draggedTask];
        return [...old, draggedTask];
      });
      return;
    }

    const overId = over.id as string;

    // Determine if dropped on a column or another task
    const validStatuses = COLUMN_CONFIG.map((col) => col.id);
    const isDroppedOnColumn = validStatuses.includes(overId as TaskStatus);

    let newStatus: TaskStatus;
    let newOrder: number;

    if (isDroppedOnColumn) {
      // Dropped on a column header - place at end of column
      newStatus = overId as TaskStatus;
      const tasksInColumn =
        tasks?.filter(
          (task) => task.status === newStatus && task.id !== taskId
        ) || [];
      newOrder =
        tasksInColumn.length > 0
          ? Math.max(...tasksInColumn.map((t) => t.order)) + 1
          : 0;
    } else {
      // Dropped on another task - get position and status from that task
      const targetTask = tasks?.find((task) => task.id === overId);
      if (!targetTask) {
        // Invalid drop target, revert
        queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
          if (!old) return [draggedTask];
          return [...old, draggedTask];
        });
        return;
      }

      newStatus = targetTask.status;
      newOrder = targetTask.order;
    }

    // Check if position actually changed
    if (draggedTask.status === newStatus && draggedTask.order === newOrder) {
      // No change needed, just add back
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
        if (!old) return [draggedTask];
        return [...old, draggedTask];
      });
      return;
    }

    // Prevent multiple simultaneous updates
    if (isUpdatingTask) {
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
        if (!old) return [draggedTask];
        return [...old, draggedTask];
      });
      return;
    }

    // Optimistically update the UI
    queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
      if (!old) return [draggedTask];

      // Remove the dragged task from its current position
      const withoutDragged = old.filter((task) => task.id !== taskId);

      // Update orders for reordering
      const reorderedTasks = withoutDragged.map((task) => {
        if (task.status === newStatus && task.order >= newOrder) {
          return { ...task, order: task.order + 1 };
        }
        return task;
      });

      // Create the updated task
      const updatedTask = {
        ...draggedTask,
        status: newStatus,
        order: newOrder,
        updatedAt: new Date().toISOString(),
      };

      // Add the updated task back
      return [...reorderedTasks, updatedTask];
    });

    // Prepare update data
    const updateData = { status: newStatus, order: newOrder };

    // Call the mutation for server sync
    updateTaskMutation(
      {
        id: taskId,
        data: updateData,
      },
      {
        onError: () => {
          // Revert to original position on error
          queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
            if (!old) return [draggedTask];
            // Remove the failed task and add back the original
            const tasksWithoutFailed = old.filter((t) => t.id !== taskId);
            return [...tasksWithoutFailed, draggedTask];
          });
          toast.error("Failed to move task", {
            description:
              "Sorry, there was an issue moving the task. Please try again.",
          });
        },
        onSuccess: () => {
          const statusChanged = draggedTask.status !== newStatus;
          if (statusChanged) {
            toast.success("Task moved successfully", {
              description: `Task moved to ${
                COLUMN_CONFIG.find((col) => col.id === newStatus)?.title
              }`,
            });
          }
        },
      }
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onCreateTask={() => setIsCreateModalOpen(true)} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load tasks
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {error.message || "Something went wrong. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onCreateTask={() => setIsCreateModalOpen(true)} />

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          // Revert task to original position if drag is cancelled
          if (activeTask) {
            queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
              if (!old) return [activeTask];
              return [...old, activeTask];
            });
          }
          setActiveTask(null);
        }}
      >
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 mx-auto">
            {COLUMN_CONFIG.map((column, index) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <TaskColumn
                    column={column}
                    tasks={filteredTasks[column.id as TaskStatus]}
                    isDraggedOver={draggedOverContainer === column.id}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </main>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-2">
              <EditableTaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
