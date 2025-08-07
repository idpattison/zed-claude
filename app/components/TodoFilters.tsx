"use client";

import { FilterType } from "../types";

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TodoFilters({ currentFilter, onFilterChange }: TodoFiltersProps) {
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="flex gap-2">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`btn btn-sm ${
            currentFilter === key ? "btn-primary" : "btn-ghost"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
