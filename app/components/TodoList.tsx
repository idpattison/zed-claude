"use client";

import { Todo, FilterType } from "../types";
import { TodoItem } from "./TodoItem";
import { EmptyState } from "./EmptyState";

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export function TodoList({ todos, filter, onToggle, onDelete, onUpdate }: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
