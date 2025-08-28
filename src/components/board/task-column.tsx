"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@/types";
import { DraggableTaskCard } from "./draggable-task-card";

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const getColumnColor = (status: TaskStatus) => {
  switch (status) {
    case "todo":
      return "border-l-blue-500";
    case "in-progress":
      return "border-l-yellow-500";
    case "done":
      return "border-l-green-500";
    default:
      return "border-l-gray-500";
  }
};

export function TaskColumn({ title, status, tasks, onTaskClick }: TaskColumnProps) {
  const filteredTasks = tasks.filter(task => task.status === status);
  
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${getColumnColor(status)} ${
      isOver ? "bg-blue-50" : ""
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700">{title}</h2>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
          {filteredTasks.length}
        </span>
      </div>
      
      <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
        <SortableContext 
          items={filteredTasks.map(task => task.id)} 
          strategy={verticalListSortingStrategy}
        >
          {filteredTasks.map((task) => (
            <DraggableTaskCard 
              key={task.id} 
              task={task} 
              onClick={() => onTaskClick?.(task)}
            />
          ))}
        </SortableContext>
        
        {filteredTasks.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            No tasks in {title.toLowerCase()}
          </div>
        )}
      </div>
    </div>
  );
}
