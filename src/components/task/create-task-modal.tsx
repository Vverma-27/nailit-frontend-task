"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useCreateTask } from "@/hooks/api/use-tasks";
import { TASK_PRIORITIES } from "@/lib/constants";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { TaskPriority } from "@/types";
import { generateId } from "@/lib/utils";

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskModal({ open, onOpenChange }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const createTaskMutation = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;
    createTaskMutation.mutate(
      {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        priority,
        status: "todo",
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully", {
            description: `"${title.trim()}" has been added to your board.`,
          });
          // Reset form
          setTitle("");
          setDescription("");
          setPriority("medium");
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to create task", {
            description:
              "Sorry, there was an issue creating the task. Please try again.",
          });
        },
      }
    );
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to your sprint board.
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <Select
                value={priority}
                onValueChange={(value: TaskPriority) => setPriority(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TASK_PRIORITIES.LOW}>Low</SelectItem>
                  <SelectItem value={TASK_PRIORITIES.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={TASK_PRIORITIES.HIGH}>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {createTaskMutation.error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md"
            >
              {createTaskMutation.error.message}
            </motion.div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createTaskMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTaskMutation.isPending || !title.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createTaskMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
