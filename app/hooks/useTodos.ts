"use client";

import { useState, useEffect } from "react";
import { Todo, FilterType, TodoStats } from "../types";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos from API on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await response.json();
      const todosWithDates = data.todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));

      setTodos(todosWithDates);
    } catch (error) {
      console.error("Error loading todos:", error);
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text: string) => {
    if (!text.trim()) return;

    try {
      setError(null);

      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const data = await response.json();
      const newTodo = {
        ...data.todo,
        createdAt: new Date(data.todo.createdAt),
      };

      setTodos((prev) => [newTodo, ...prev]);
    } catch (error) {
      console.error("Error adding todo:", error);
      setError("Failed to add todo");
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle todo");
      }

      const data = await response.json();
      const updatedTodo = {
        ...data.todo,
        createdAt: new Date(data.todo.createdAt),
      };

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
      setError("Failed to update todo");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Failed to delete todo");
    }
  };

  const updateTodo = async (id: string, text: string) => {
    if (!text.trim()) return;

    try {
      setError(null);

      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const data = await response.json();
      const updatedTodo = {
        ...data.todo,
        createdAt: new Date(data.todo.createdAt),
      };

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );
    } catch (error) {
      console.error("Error updating todo:", error);
      setError("Failed to update todo");
    }
  };

  const clearCompleted = async () => {
    try {
      setError(null);

      const response = await fetch("/api/todos", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear completed todos");
      }

      setTodos((prev) => prev.filter((todo) => !todo.completed));
    } catch (error) {
      console.error("Error clearing completed todos:", error);
      setError("Failed to clear completed todos");
    }
  };

  const getFilteredTodos = () => {
    return todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });
  };

  const getStats = (): TodoStats => {
    const active = todos.filter((todo) => !todo.completed).length;
    const completed = todos.filter((todo) => todo.completed).length;
    return {
      total: todos.length,
      active,
      completed,
    };
  };

  return {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    filteredTodos: getFilteredTodos(),
    stats: getStats(),
    loading,
    error,
    refetch: loadTodos,
  };
}
