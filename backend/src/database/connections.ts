import { Pool, PoolClient } from 'pg';
import { MongoClient, Db, Collection } from 'mongodb';
import config from '../utils/config';
import logger from '../utils/logger';

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  query(sql: string, params?: any[]): Promise<any>;
  transaction<T>(callback: (client: any) => Promise<T>): Promise<T>;
  health(): Promise<{ connected: boolean; responseTime: number }>;
}

// PostgreSQL Adapter
export class PostgreSQLAdapter implements DatabaseAdapter {
  private pool: Pool | null = null;
  private connected = false;

  constructor(private connectionString: string) {}

  async connect(): Promise<void> {
    try {
      this.pool = new Pool({
        connectionString: this.connectionString,
        max: 20, // Maximum pool size
        min: 5,  // Minimum pool size
        idle: 10000,
        acquire: 30000,
        dispose: 5000,
        ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.connected = true;
      logger.info('PostgreSQL connection established successfully');
    } catch (error) {
      this.connected = false;
      logger.error('Failed to connect to PostgreSQL', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.connected = false;
      logger.info('PostgreSQL connection closed');
    }
  }

  isConnected(): boolean {
    return this.connected && this.pool !== null;
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    const start = Date.now();
    try {
      const result = await this.pool.query(sql, params);
      const duration = Date.now() - start;
      
      logger.debug('Query executed', {
        sql: sql.substring(0, 100),
        params: params.length,
        duration,
        rows: result.rowCount
      });

      return result;
    } catch (error) {
      logger.error('Query failed', {
        sql: sql.substring(0, 100),
        params,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async health(): Promise<{ connected: boolean; responseTime: number }> {
    const start = Date.now();
    try {
      if (!this.pool) {
        return { connected: false, responseTime: -1 };
      }

      await this.pool.query('SELECT 1');
      const responseTime = Date.now() - start;
      return { connected: true, responseTime };
    } catch (error) {
      return { connected: false, responseTime: Date.now() - start };
    }
  }
}

// MongoDB Adapter
export class MongoDBAdapter implements DatabaseAdapter {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private connected = false;

  constructor(private connectionString: string, private databaseName: string) {}

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.connectionString, {
        maxPoolSize: 20,
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      await this.client.connect();
      this.db = this.client.db(this.databaseName);

      // Test connection
      await this.db.admin().ping();

      this.connected = true;
      logger.info('MongoDB connection established successfully');
    } catch (error) {
      this.connected = false;
      logger.error('Failed to connect to MongoDB', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.connected = false;
      logger.info('MongoDB connection closed');
    }
  }

  isConnected(): boolean {
    return this.connected && this.client !== null;
  }

  async query(operation: string, params: any = {}): Promise<any> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    const start = Date.now();
    try {
      const [collection, method] = operation.split('.');
      const coll = this.db.collection(collection);
      
      let result;
      switch (method) {
        case 'find':
          result = await coll.find(params.filter || {}, params.options || {}).toArray();
          break;
        case 'findOne':
          result = await coll.findOne(params.filter || {}, params.options || {});
          break;
        case 'insertOne':
          result = await coll.insertOne(params.document);
          break;
        case 'insertMany':
          result = await coll.insertMany(params.documents);
          break;
        case 'updateOne':
          result = await coll.updateOne(params.filter, params.update, params.options || {});
          break;
        case 'updateMany':
          result = await coll.updateMany(params.filter, params.update, params.options || {});
          break;
        case 'deleteOne':
          result = await coll.deleteOne(params.filter);
          break;
        case 'deleteMany':
          result = await coll.deleteMany(params.filter);
          break;
        case 'countDocuments':
          result = await coll.countDocuments(params.filter || {});
          break;
        default:
          throw new Error(`Unsupported operation: ${method}`);
      }

      const duration = Date.now() - start;
      logger.debug('MongoDB operation executed', {
        operation,
        duration,
        collection
      });

      return result;
    } catch (error) {
      logger.error('MongoDB operation failed', {
        operation,
        params,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async transaction<T>(callback: (session: any) => Promise<T>): Promise<T> {
    if (!this.client) {
      throw new Error('Database not connected');
    }

    const session = this.client.startSession();
    
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async health(): Promise<{ connected: boolean; responseTime: number }> {
    const start = Date.now();
    try {
      if (!this.db) {
        return { connected: false, responseTime: -1 };
      }

      await this.db.admin().ping();
      const responseTime = Date.now() - start;
      return { connected: true, responseTime };
    } catch (error) {
      return { connected: false, responseTime: Date.now() - start };
    }
  }

  getCollection(name: string): Collection {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection(name);
  }
}

// Database Factory
export class DatabaseFactory {
  static create(type: 'postgresql' | 'mongodb', config: any): DatabaseAdapter {
    switch (type) {
      case 'postgresql':
        return new PostgreSQLAdapter(config.connectionString);
      case 'mongodb':
        return new MongoDBAdapter(config.connectionString, config.databaseName);
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }
}

// Connection Manager
export class ConnectionManager {
  private adapters: Map<string, DatabaseAdapter> = new Map();
  private primaryAdapter: DatabaseAdapter | null = null;

  async addConnection(name: string, adapter: DatabaseAdapter, isPrimary = false): Promise<void> {
    await adapter.connect();
    this.adapters.set(name, adapter);
    
    if (isPrimary || !this.primaryAdapter) {
      this.primaryAdapter = adapter;
    }

    logger.info(`Database connection '${name}' added`, { isPrimary });
  }

  getConnection(name?: string): DatabaseAdapter {
    if (name) {
      const adapter = this.adapters.get(name);
      if (!adapter) {
        throw new Error(`Connection '${name}' not found`);
      }
      return adapter;
    }

    if (!this.primaryAdapter) {
      throw new Error('No primary database connection available');
    }

    return this.primaryAdapter;
  }

  async closeAll(): Promise<void> {
    const promises = Array.from(this.adapters.values()).map(adapter => 
      adapter.disconnect().catch(error => 
        logger.error('Error closing database connection', error)
      )
    );

    await Promise.all(promises);
    this.adapters.clear();
    this.primaryAdapter = null;
    
    logger.info('All database connections closed');
  }

  async healthCheck(): Promise<{ [name: string]: { connected: boolean; responseTime: number } }> {
    const results: { [name: string]: { connected: boolean; responseTime: number } } = {};

    for (const [name, adapter] of this.adapters) {
      results[name] = await adapter.health();
    }

    return results;
  }

  listConnections(): string[] {
    return Array.from(this.adapters.keys());
  }
}

// Global connection manager instance
export const connectionManager = new ConnectionManager();

// Initialize database connections based on environment
export async function initializeDatabases(): Promise<void> {
  try {
    const dbType = config.databaseType || 'json'; // json, postgresql, mongodb

    if (dbType === 'postgresql' && config.postgresUrl) {
      const pgAdapter = DatabaseFactory.create('postgresql', {
        connectionString: config.postgresUrl
      });
      await connectionManager.addConnection('postgresql', pgAdapter, true);
    }

    if (dbType === 'mongodb' && config.mongoUrl) {
      const mongoAdapter = DatabaseFactory.create('mongodb', {
        connectionString: config.mongoUrl,
        databaseName: config.mongoDatabaseName || 'backend_app'
      });
      await connectionManager.addConnection('mongodb', mongoAdapter, true);
    }

    logger.info('Database initialization completed', {
      type: dbType,
      connections: connectionManager.listConnections()
    });
  } catch (error) {
    logger.error('Database initialization failed', error);
    throw error;
  }
}

export default {
  ConnectionManager,
  DatabaseFactory,
  PostgreSQLAdapter,
  MongoDBAdapter,
  connectionManager,
  initializeDatabases
}; 