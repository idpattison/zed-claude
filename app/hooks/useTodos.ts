"use client";

import { useState, useEffect } from "react";
import { Todo, FilterType, TodoStats } from "../types";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      // Convert date strings back to Date objects
      const todosWithDates = parsedTodos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
      setTodos(todosWithDates);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    if (text.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([newTodo, ...todos]);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: string, text: string) => {
    if (text.trim() !== "") {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: text.trim() } : todo,
        ),
      );
    }
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
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
  };
}
