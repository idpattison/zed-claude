"use client";

import { TodoStats as TodoStatsType } from "../types";

interface TodoStatsProps {
  stats: TodoStatsType;
}

export function TodoStats({ stats }: TodoStatsProps) {
  return (
    <div className="stats shadow bg-white dark:bg-gray-800">
      <div className="stat">
        <div className="stat-title text-xs">Active</div>
        <div className="stat-value text-lg text-primary">{stats.active}</div>
      </div>
      <div className="stat">
        <div className="stat-title text-xs">Completed</div>
        <div className="stat-value text-lg text-success">{stats.completed}</div>
      </div>
      <div className="stat">
        <div className="stat-title text-xs">Total</div>
        <div className="stat-value text-lg">{stats.total}</div>
      </div>
    </div>
  );
}
