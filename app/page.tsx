"use client";

import { useTodos } from "./hooks/useTodos";
import {
  Header,
  TodoForm,
  TodoStats,
  TodoFilters,
  TodoList,
  ClearCompleted,
  Footer,
} from "./components";

export default function TodoApp() {
  const {
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    filteredTodos,
    stats,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Header />

        <TodoForm onAddTodo={addTodo} />

        {/* Stats and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <TodoStats stats={stats} />
          <TodoFilters currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Todo List */}
        <TodoList
          todos={filteredTodos}
          filter={filter}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />

        <ClearCompleted
          completedCount={stats.completed}
          onClearCompleted={clearCompleted}
        />

        <Footer />
      </div>
    </div>
  );
}
