"use client";

import { Header } from "@/components/layout/header";
import { SprintBoard } from "@/components/board/sprint-board";

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SprintBoard />
    </div>
  );
}
