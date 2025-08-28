"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTask, useDeleteTask } from "@/hooks/api/use-tasks";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { GripVertical, Edit3, Check, X, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import type { Task, TaskPriority } from "@/types";
import { QUERY_KEYS, TASK_PRIORITIES_LIST } from "@/lib/constants";
import { useOfflineStore } from "@/stores/offline-store";
import { useQueryClient } from "@tanstack/react-query";
import { API_ERROR_CODES, ApiError } from "@/lib/api-client";

interface EditableTaskCardProps {
  task: Task;
}

export function EditableTaskCard({ task }: EditableTaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const queryClient = useQueryClient();

  const { mutate: updateTask, isPending: updatePending } = useUpdateTask();
  const { mutate: deleteTask, isPending: deletePending } = useDeleteTask();
  const { isOnline, getQueuedTaskIds, queueAction } = useOfflineStore();

  // Check if this task has any queued actions or is a temporary task
  const queuedTaskIds = getQueuedTaskIds();
  const isTemporaryTask = task.id.startsWith("temp-");
  const isQueued =
    !isOnline && (queuedTaskIds.includes(task.id) || isTemporaryTask);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (deletePending || updatePending) return;
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    let originalTask: Task | null = null;
    queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
      if (!old) return [task];
      return old.map((t) => {
        if (t.id === task.id) {
          originalTask = t;
        }
        return t.id === task.id
          ? {
              ...t,
              title: title.trim(),
              description: description.trim(),
              priority,
            }
          : t;
      });
    });
    setIsEditing(false);
    if (!isOnline) {
      queueAction("UPDATE", task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
      });
      return;
    }
    updateTask(
      {
        id: task.id,
        data: {
          title: title.trim(),
          description: description.trim(),
          priority,
        },
      },
      {
        onSuccess: () => {
          toast.success("Task updated successfully");
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.code === API_ERROR_CODES.NETWORK_ERROR) {
              toast.error("Network request failed", {
                description: "You are offline. We have queued your request.",
              });
              return;
            }
          }
          if (originalTask)
            queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
              if (!old) return [];
              return old.map((t) => (t.id === task.id ? originalTask! : t));
            });
          toast.error("Failed to update task");

          setTitle(task.title);
          setDescription(task.description);
          setPriority(task.priority);
        },
      }
    );
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (deletePending || updatePending) return;
    if (!isOnline) {
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => {
        if (!old) return [];
        return old.filter((t) => t.id !== task.id);
      });
      queueAction("DELETE", task.id);
      return;
    }
    deleteTask(task.id, {
      onSuccess: () => {
        toast.success("Task deleted successfully");
      },
      onError: (err) => {
        toast.error("Failed to delete task");
      },
    });
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-3 cursor-pointer transition-all duration-200 hover:shadow-md touch-none ${
        isDragging ? "opacity-50 rotate-2 shadow-lg" : ""
      } ${isEditing ? "ring-2 ring-blue-500" : ""} ${
        isQueued
          ? "ring-1 ring-amber-300 bg-amber-50/50 dark:bg-amber-900/10 dark:ring-amber-600"
          : ""
      }`}
      {...(!isEditing ? attributes : {})}
      {...(!isEditing ? listeners : {})}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1">
            {!isEditing && (
              <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-medium"
                placeholder="Task title"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <h3 className="font-medium text-sm leading-tight flex-1">
                  {task.title}
                </h3>
                {isQueued && (
                  <div
                    className="flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200 px-2 py-1 rounded-full text-xs"
                    title="This task has pending changes that will sync when you're back online"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Queued</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  className="h-6 w-6 p-0"
                >
                  <Check className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </>
            ) : (
              <>
                {!isQueued && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                    className="h-6 w-6 p-0"
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDelete();
                  }}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="text-xs resize-none"
              rows={3}
            />
            <Select
              value={priority}
              onValueChange={(value: TaskPriority) => setPriority(value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_PRIORITIES_LIST.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="text-xs">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <>
            {task.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className={`text-xs ${priorityColors[task.priority]}`}
              >
                {task.priority}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(task.updatedAt)}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
