"use client";

import { motion } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { EditableTaskCard } from "@/components/task/editable-task-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types";

interface TaskColumnProps {
  column: {
    id: string;
    title: string;
    color: string;
  };
  tasks: Task[];
  isDraggedOver?: boolean;
}

export function TaskColumn({
  column,
  tasks,
  isDraggedOver = false,
}: TaskColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          {column.title}
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </h2>
      </div>

      <Card
        ref={setNodeRef}
        className={`min-h-[300px] md:min-h-[500px] p-3 md:p-4 transition-colors ${
          column.color
        } ${
          isOver || isDraggedOver
            ? "ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/10"
            : ""
        }`}
      >
        <SortableContext
          strategy={verticalListSortingStrategy}
          items={tasks.map((t) => t.id)}
        >
          <div className="space-y-2 md:space-y-3">
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                <p className="text-sm">
                  No tasks in {column.title.toLowerCase()}
                </p>
                {(isOver || isDraggedOver) && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Drop task here
                  </p>
                )}
              </motion.div>
            ) : (
              tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EditableTaskCard task={task} />
                </motion.div>
              ))
            )}
          </div>
        </SortableContext>
      </Card>
    </div>
  );
}
