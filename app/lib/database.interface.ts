export interface DatabaseTodo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO string for database storage
}

export interface TodoDatabase {
  // Initialize the database and create tables if needed
  initialize(): Promise<void>;

  // Get all todos
  getAllTodos(): Promise<DatabaseTodo[]>;

  // Add a new todo
  addTodo(todo: Omit<DatabaseTodo, 'id'>): Promise<DatabaseTodo>;

  // Update a todo
  updateTodo(id: string, updates: Partial<Pick<DatabaseTodo, 'text' | 'completed'>>): Promise<DatabaseTodo | null>;

  // Delete a todo
  deleteTodo(id: string): Promise<boolean>;

  // Delete all completed todos
  deleteCompletedTodos(): Promise<number>;

  // Close database connection
  close(): Promise<void>;
}

export interface TodoDatabaseConfig {
  filepath?: string;
  verbose?: boolean;
}
