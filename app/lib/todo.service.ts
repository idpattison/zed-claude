import { Todo } from '../types';
import { DatabaseTodo, TodoDatabase } from './database.interface';
import { DatabaseFactory } from './database.factory';

export class TodoService {
  private static instance: TodoService | null = null;
  private database: TodoDatabase | null = null;
  private initialized = false;

  private constructor() {}

  // Singleton pattern to ensure one database connection
  static getInstance(): TodoService {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const config = DatabaseFactory.getDefaultConfig();
      this.database = await DatabaseFactory.create(config);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize TodoService:', error);
      throw error;
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized || !this.database) {
      throw new Error('TodoService not initialized. Call initialize() first.');
    }
  }

  // Convert database todo to frontend todo
  private mapDatabaseTodoToTodo(dbTodo: DatabaseTodo): Todo {
    return {
      id: dbTodo.id,
      text: dbTodo.text,
      completed: dbTodo.completed,
      createdAt: new Date(dbTodo.createdAt)
    };
  }

  // Convert frontend todo to database todo
  private mapTodoToDatabaseTodo(todo: Todo): DatabaseTodo {
    return {
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString()
    };
  }

  async getAllTodos(): Promise<Todo[]> {
    this.ensureInitialized();

    try {
      const dbTodos = await this.database!.getAllTodos();
      return dbTodos.map(dbTodo => this.mapDatabaseTodoToTodo(dbTodo));
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      throw new Error('Failed to load todos from database');
    }
  }

  async addTodo(text: string): Promise<Todo> {
    this.ensureInitialized();

    if (!text.trim()) {
      throw new Error('Todo text cannot be empty');
    }

    try {
      const newDbTodo = await this.database!.addTodo({
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      });

      return this.mapDatabaseTodoToTodo(newDbTodo);
    } catch (error) {
      console.error('Failed to add todo:', error);
      throw new Error('Failed to add todo to database');
    }
  }

  async toggleTodo(id: string): Promise<Todo | null> {
    this.ensureInitialized();

    try {
      // First get the current todo to know its completion status
      const todos = await this.getAllTodos();
      const currentTodo = todos.find(todo => todo.id === id);

      if (!currentTodo) {
        return null;
      }

      const updatedDbTodo = await this.database!.updateTodo(id, {
        completed: !currentTodo.completed
      });

      return updatedDbTodo ? this.mapDatabaseTodoToTodo(updatedDbTodo) : null;
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      throw new Error('Failed to update todo in database');
    }
  }

  async updateTodoText(id: string, text: string): Promise<Todo | null> {
    this.ensureInitialized();

    if (!text.trim()) {
      throw new Error('Todo text cannot be empty');
    }

    try {
      const updatedDbTodo = await this.database!.updateTodo(id, {
        text: text.trim()
      });

      return updatedDbTodo ? this.mapDatabaseTodoToTodo(updatedDbTodo) : null;
    } catch (error) {
      console.error('Failed to update todo text:', error);
      throw new Error('Failed to update todo in database');
    }
  }

  async deleteTodo(id: string): Promise<boolean> {
    this.ensureInitialized();

    try {
      return await this.database!.deleteTodo(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw new Error('Failed to delete todo from database');
    }
  }

  async clearCompleted(): Promise<number> {
    this.ensureInitialized();

    try {
      return await this.database!.deleteCompletedTodos();
    } catch (error) {
      console.error('Failed to clear completed todos:', error);
      throw new Error('Failed to clear completed todos from database');
    }
  }

  async close(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
      this.initialized = false;
    }
  }

  // Health check method
  async isHealthy(): Promise<boolean> {
    try {
      this.ensureInitialized();
      // Try to fetch todos as a health check
      await this.database!.getAllTodos();
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const todoService = TodoService.getInstance();
