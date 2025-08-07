"use client";

import { useState } from "react";

interface TodoFormProps {
  onAddTodo: (text: string) => void;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAddTodo(inputText);
      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="card bg-white dark:bg-gray-800 shadow-xl mb-6">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="input input-bordered flex-1 text-lg"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            type="submit"
            className="btn btn-primary px-6"
            disabled={!inputText.trim()}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
