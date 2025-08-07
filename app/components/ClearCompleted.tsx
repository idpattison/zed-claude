"use client";

interface ClearCompletedProps {
  completedCount: number;
  onClearCompleted: () => void;
}

export function ClearCompleted({ completedCount, onClearCompleted }: ClearCompletedProps) {
  if (completedCount === 0) {
    return null;
  }

  return (
    <div className="text-center mt-6">
      <button
        onClick={onClearCompleted}
        className="btn btn-outline btn-error"
      >
        Clear {completedCount} completed task
        {completedCount === 1 ? "" : "s"}
      </button>
    </div>
  );
}
