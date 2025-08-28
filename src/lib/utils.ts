import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

let isOnlineCache = true;
let lastCheckTime = 0;
const CACHE_DURATION = 5000;

export async function isOnline(): Promise<boolean> {
  const now = Date.now();

  if (now - lastCheckTime < CACHE_DURATION) {
    return isOnlineCache;
  }

  if (!navigator.onLine) {
    isOnlineCache = false;
    lastCheckTime = now;
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(API_BASE_URL, {
      method: "HEAD",
      cache: "no-cache",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    isOnlineCache = response.ok;
  } catch (error) {
    isOnlineCache = false;
  }

  lastCheckTime = now;
  return isOnlineCache;
}

export function isOnlineSync(): boolean {
  return isOnlineCache;
}

export function simulateNetworkFailure(): boolean {
  return Math.random() <= 0.1;
}
