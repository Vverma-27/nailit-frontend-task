"use client";

import { Header } from "@/components/layout/header";

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold mb-4 text-gray-700">To Do</h2>
            <div className="space-y-3">
              <div className="p-3 bg-white border rounded shadow-sm">
                <h3 className="font-medium">Sample Task</h3>
                <p className="text-sm text-gray-600">Task description</p>
                <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">High</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold mb-4 text-gray-700">In Progress</h2>
            <div className="space-y-3">
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold mb-4 text-gray-700">Done</h2>
            <div className="space-y-3">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
