import sqlite3 from 'sqlite3';
import { DatabaseTodo, TodoDatabase, TodoDatabaseConfig } from './database.interface';

export class SQLiteTodoDatabase implements TodoDatabase {
  private db: sqlite3.Database | null = null;
  private filepath: string;
  private verbose: boolean;

  constructor(config: TodoDatabaseConfig = {}) {
    this.filepath = config.filepath || './data/todos.db';
    this.verbose = config.verbose || false;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const Database = this.verbose ? sqlite3.verbose().Database : sqlite3.Database;

      this.db = new Database(this.filepath, (err) => {
        if (err) {
          reject(new Error(`Failed to connect to SQLite database: ${err.message}`));
          return;
        }

        // Create the todos table if it doesn't exist
        this.db!.run(`
          CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            createdAt TEXT NOT NULL
          )
        `, (err) => {
          if (err) {
            reject(new Error(`Failed to create todos table: ${err.message}`));
            return;
          }
          resolve();
        });
      });
    });
  }

  async getAllTodos(): Promise<DatabaseTodo[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.all(
        'SELECT * FROM todos ORDER BY createdAt DESC',
        (err, rows: any[]) => {
          if (err) {
            reject(new Error(`Failed to fetch todos: ${err.message}`));
            return;
          }

          const todos: DatabaseTodo[] = rows.map(row => ({
            id: row.id,
            text: row.text,
            completed: Boolean(row.completed),
            createdAt: row.createdAt
          }));

          resolve(todos);
        }
      );
    });
  }

  async addTodo(todo: Omit<DatabaseTodo, 'id'>): Promise<DatabaseTodo> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const id = Date.now().toString();
      const newTodo: DatabaseTodo = {
        id,
        ...todo
      };

      this.db.run(
        'INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, ?, ?)',
        [newTodo.id, newTodo.text, newTodo.completed ? 1 : 0, newTodo.createdAt],
        function(err) {
          if (err) {
            reject(new Error(`Failed to add todo: ${err.message}`));
            return;
          }
          resolve(newTodo);
        }
      );
    });
  }

  async updateTodo(id: string, updates: Partial<Pick<DatabaseTodo, 'text' | 'completed'>>): Promise<DatabaseTodo | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      // Build dynamic update query
      const updateFields: string[] = [];
      const values: any[] = [];

      if (updates.text !== undefined) {
        updateFields.push('text = ?');
        values.push(updates.text);
      }

      if (updates.completed !== undefined) {
        updateFields.push('completed = ?');
        values.push(updates.completed ? 1 : 0);
      }

      if (updateFields.length === 0) {
        reject(new Error('No updates provided'));
        return;
      }

      values.push(id); // Add id for WHERE clause

      const query = `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`;

      this.db.run(query, values, function(err) {
        if (err) {
          reject(new Error(`Failed to update todo: ${err.message}`));
          return;
        }

        if (this.changes === 0) {
          resolve(null); // Todo not found
          return;
        }

        // Fetch and return the updated todo
        if (!this.db) {
          reject(new Error('Database connection lost'));
          return;
        }

        this.db!.get(
          'SELECT * FROM todos WHERE id = ?',
          [id],
          (err, row: any) => {
            if (err) {
              reject(new Error(`Failed to fetch updated todo: ${err.message}`));
              return;
            }

            if (!row) {
              resolve(null);
              return;
            }

            const updatedTodo: DatabaseTodo = {
              id: row.id,
              text: row.text,
              completed: Boolean(row.completed),
              createdAt: row.createdAt
            };

            resolve(updatedTodo);
          }
        );
      });
    });
  }

  async deleteTodo(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.run(
        'DELETE FROM todos WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(new Error(`Failed to delete todo: ${err.message}`));
            return;
          }
          resolve(this.changes > 0);
        }
      );
    });
  }

  async deleteCompletedTodos(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.run(
        'DELETE FROM todos WHERE completed = 1',
        function(err) {
          if (err) {
            reject(new Error(`Failed to delete completed todos: ${err.message}`));
            return;
          }
          resolve(this.changes);
        }
      );
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(); // Already closed
        return;
      }

      this.db.close((err) => {
        if (err) {
          reject(new Error(`Failed to close database: ${err.message}`));
          return;
        }
        this.db = null;
        resolve();
      });
    });
  }
}
