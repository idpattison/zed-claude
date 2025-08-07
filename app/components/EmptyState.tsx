"use client";

import { FilterType } from "../types";

interface EmptyStateProps {
  filter: FilterType;
}

export function EmptyState({ filter }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (filter) {
      case "completed":
        return {
          emoji: "🎉",
          message: "No completed tasks yet",
        };
      case "active":
        return {
          emoji: "📝",
          message: "No active tasks! Time to add some.",
        };
      default:
        return {
          emoji: "📝",
          message: "No tasks yet. Add one above to get started!",
        };
    }
  };

  const { emoji, message } = getEmptyStateContent();

  return (
    <div className="card bg-white dark:bg-gray-800 shadow-md">
      <div className="card-body text-center py-12">
        <div className="text-6xl mb-4">{emoji}</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">{message}</p>
      </div>
    </div>
  );
}
