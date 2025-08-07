import { TodoDatabase, TodoDatabaseConfig } from './database.interface';
import { SQLiteTodoDatabase } from './sqlite.database';

export type DatabaseType = 'sqlite' | 'postgres' | 'mongodb' | 'memory';

export interface DatabaseFactoryConfig extends TodoDatabaseConfig {
  type: DatabaseType;
}

export class DatabaseFactory {
  static async create(config: DatabaseFactoryConfig): Promise<TodoDatabase> {
    switch (config.type) {
      case 'sqlite':
        const sqliteDb = new SQLiteTodoDatabase(config);
        await sqliteDb.initialize();
        return sqliteDb;

      case 'postgres':
        // Future implementation
        throw new Error('PostgreSQL support not yet implemented');

      case 'mongodb':
        // Future implementation
        throw new Error('MongoDB support not yet implemented');

      case 'memory':
        // Future implementation for testing
        throw new Error('In-memory database support not yet implemented');

      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }

  static getDefaultConfig(): DatabaseFactoryConfig {
    return {
      type: 'sqlite',
      filepath: './data/todos.db',
      verbose: process.env.NODE_ENV === 'development',
    };
  }
}
