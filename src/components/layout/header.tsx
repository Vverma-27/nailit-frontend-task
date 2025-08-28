"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLogout } from "@/hooks/api/use-auth";
import { useAppStore } from "@/stores/app-store";
import { OfflineIndicator } from "@/components/layout/offline-indicator";
import { LogOut, Search, Plus, Moon, Sun, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { TaskPriority } from "@/types";

interface HeaderProps {
  onCreateTask: () => void;
}

export function Header({ onCreateTask }: HeaderProps) {
  const logoutMutation = useLogout();
  const {
    darkMode,
    searchQuery,
    priorityFilter,
    setDarkMode,
    setSearchQuery,
    setPriorityFilter,
  } = useAppStore();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      {/* Desktop Layout */}
      <div className="hidden min-[900px]:flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Sprint Board
            </h1>
          </motion.div>

          <OfflineIndicator />
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value as TaskPriority)}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <Moon className="w-4 h-4" />
          </div>

          <Button
            onClick={onCreateTask}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Layout - Regular mobile (450px+) */}
      <div className="min-[900px]:hidden min-[450px]:block hidden space-y-3">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Sprint Board
            </h1>
          </motion.div>

          <div className="flex items-center gap-2">
            <OfflineIndicator />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Select
              value={priorityFilter}
              onValueChange={(value) =>
                setPriorityFilter(value as TaskPriority)
              }
            >
              <SelectTrigger className="w-[120px] min-w-fit flex-shrink-0">
                <div className="flex items-center gap-0.5">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Priority" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <Moon className="w-4 h-4" />
            </div>

            <Button
              onClick={onCreateTask}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Extra Small Mobile Layout - Below 450px */}
      <div className="min-[450px]:hidden block space-y-2">
        {/* Row 1: Logo + Actions */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5"
          >
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white">
              Sprint Board
            </h1>
          </motion.div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="px-2"
          >
            <LogOut className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex items-center justify-between w-full">
          <OfflineIndicator />
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <Moon className="w-4 h-4" />
            </div>
            <Button
              onClick={onCreateTask}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 px-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Row 2: Search + Filter */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>

          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value as TaskPriority)}
          >
            <SelectTrigger className="w-16 h-8 px-2 flex-shrink-0">
              <Filter className="w-3.5 h-3.5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Med</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
