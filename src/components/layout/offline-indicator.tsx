"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOfflineQueue } from "@/hooks/use-offline-queue";
import { offlineQueueService } from "@/lib/offline-queue-service";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function OfflineIndicator() {
  const { isOnline, queue, queuedCount } = useOfflineQueue();

  const handleRetryQueue = async () => {
    if (isOnline) {
      await offlineQueueService.processQueue();
    }
  };

  return (
    <AnimatePresence>
      <div className="flex items-center gap-2">
        {/* Online/Offline Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {isOnline ? (
            <Badge
              variant="outline"
              className="text-green-600 border-green-600"
            >
              <Wifi className="w-3 h-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-600"
            >
              <WifiOff className="w-3 h-3 mr-1" />
              Offline
            </Badge>
          )}
        </motion.div>

        {/* Queue Status */}
        <AnimatePresence>
          {queuedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <Badge
                variant="outline"
                className={`${
                  isOnline
                    ? "text-blue-600 border-blue-600"
                    : "text-yellow-600 border-yellow-600"
                }`}
              >
                <Clock className="w-3 h-3 mr-1" />
                {queuedCount} queued
              </Badge>

              {isOnline && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetryQueue}
                  className="h-7 px-2 text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success indicator when queue is empty and was previously filled */}
        <AnimatePresence>
          {isOnline && queuedCount === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Synced
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
