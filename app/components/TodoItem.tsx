"use client";

import { useState } from "react";
import { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={`card shadow-md transition-all duration-200 hover:shadow-lg ${
        todo.completed
          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      <div className="card-body py-4">
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="checkbox checkbox-primary checkbox-lg"
          />

          {/* Todo Text */}
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input input-bordered w-full"
                autoFocus
              />
            ) : (
              <div>
                <p
                  className={`text-lg ${
                    todo.completed
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {todo.text}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {todo.createdAt.toLocaleDateString()} at{" "}
                  {todo.createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="btn btn-success btn-sm"
                  disabled={!editText.trim()}
                >
                  ✓
                </button>
                <button onClick={handleCancel} className="btn btn-ghost btn-sm">
                  ✕
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="btn btn-ghost btn-sm hover:btn-info"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="btn btn-ghost btn-sm hover:btn-error"
                  title="Delete"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
