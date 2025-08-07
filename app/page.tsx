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
    loading,
    error,
    refetch,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Header />

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
            <div>
              <button className="btn btn-sm btn-ghost" onClick={refetch}>
                Retry
              </button>
            </div>
          </div>
        )}

        <TodoForm onAddTodo={addTodo} />

        {/* Stats and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <TodoStats stats={stats} />
          <TodoFilters currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="card bg-white dark:bg-gray-800 shadow-md">
            <div className="card-body text-center py-12">
              <div className="loading loading-spinner loading-lg mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">
                Loading your todos...
              </p>
            </div>
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            filter={filter}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        )}

        <ClearCompleted
          completedCount={stats.completed}
          onClearCompleted={clearCompleted}
        />

        <Footer />
      </div>
    </div>
  );
}
