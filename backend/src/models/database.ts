import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import config from '../utils/config';
import logger from '../utils/logger';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);

// Database types
export interface DatabaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface DatabaseTable {
  [key: string]: DatabaseRecord[];
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchCriteria {
  [key: string]: unknown;
}

// In-memory database implementation for development
// In production, you would use a real database like PostgreSQL or MongoDB
export class DatabaseManager {
  private static instance: DatabaseManager;
  private data: DatabaseTable = {};
  private initialized = false;
  private dbPath: string;

  private constructor() {
    this.dbPath = path.resolve(config.databaseUrl || './database/app.json');
    this.initializeDatabase();
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private async initializeDatabase(): Promise<void> {
    try {
      // Ensure database directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        await mkdir(dbDir, { recursive: true });
      }

      // Load existing data if available
      if (fs.existsSync(this.dbPath)) {
        const fileContent = await readFile(this.dbPath, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        // Initialize with empty tables
        this.data = {
          users: [],
          files: [],
          audit_logs: [],
          sessions: []
        };
        await this.saveToFile();
      }

      // Run migrations
      await this.runMigrations();
      
      this.initialized = true;
      logger.info('In-memory database initialized successfully', {
        tables: Object.keys(this.data).length,
        path: this.dbPath
      });
    } catch (error) {
      logger.error('Failed to initialize database', error);
      throw error;
    }
  }

  private async runMigrations(): Promise<void> {
    // Ensure all tables have the required structure
    if (!this.data.users) {
      this.data.users = [];
    }
    if (!this.data.files) {
      this.data.files = [];
    }
    if (!this.data.audit_logs) {
      this.data.audit_logs = [];
    }
    if (!this.data.sessions) {
      this.data.sessions = [];
    }

    // Add any new fields to existing records if needed
    this.data.users = this.data.users.map((user: DatabaseRecord) => ({
      ...user,
      id: user.id || this.generateId(),
      email: (user.email as string) || '',
      password: (user.password as string) || '',
      firstName: (user.firstName as string) || '',
      lastName: (user.lastName as string) || '',
      role: (user.role as string) || 'user',
      isActive: user.isActive !== undefined ? (user.isActive as boolean) : true,
      isEmailVerified: (user.isEmailVerified as boolean) || false,
      avatar: (user.avatar as string) || null,
      lastLogin: (user.lastLogin as string) || null,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    }));

    await this.saveToFile();
  }

  private async saveToFile(): Promise<void> {
    try {
      await writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      logger.error('Failed to save database to file', error);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Generic CRUD operations
  async find(tableName: string, criteria: SearchCriteria = {}): Promise<DatabaseRecord[]> {
    if (!this.data[tableName]) {
      return [];
    }

    let results = [...this.data[tableName]];

    // Apply filters
    Object.keys(criteria).forEach(key => {
      if (criteria[key] !== undefined && criteria[key] !== null) {
        results = results.filter(item => item[key] === criteria[key]);
      }
    });

    return results;
  }

  async findOne(tableName: string, criteria: SearchCriteria): Promise<DatabaseRecord | null> {
    const results = await this.find(tableName, criteria);
    return results.length > 0 ? results[0] ?? null : null;
  }

  async findById(tableName: string, id: string): Promise<DatabaseRecord | null> {
    return await this.findOne(tableName, { id });
  }

  async insert(tableName: string, data: Partial<DatabaseRecord>): Promise<DatabaseRecord> {
    if (!this.data[tableName]) {
      this.data[tableName] = [];
    }

    const id = data.id || this.generateId();
    const createdAt = data.createdAt || new Date().toISOString();
    
    const record: DatabaseRecord = {
      ...data,
      id,
      createdAt,
      updatedAt: new Date().toISOString()
    };

    this.data[tableName].push(record);
    await this.saveToFile();
    
    return record;
  }

  async update(tableName: string, id: string, updates: Partial<DatabaseRecord>): Promise<boolean> {
    if (!this.data[tableName]) {
      return false;
    }

    const index = this.data[tableName].findIndex((item: DatabaseRecord) => item.id === id);
    if (index === -1) {
      return false;
    }

    this.data[tableName][index] = {
      ...this.data[tableName][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveToFile();
    return true;
  }

  async delete(tableName: string, id: string): Promise<boolean> {
    if (!this.data[tableName]) {
      return false;
    }

    const index = this.data[tableName].findIndex((item: DatabaseRecord) => item.id === id);
    if (index === -1) {
      return false;
    }

    this.data[tableName].splice(index, 1);
    await this.saveToFile();
    return true;
  }

  // Pagination support
  async findWithPagination(tableName: string, criteria: any = {}, options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    
    let results = await this.find(tableName, criteria);
    
    // Sorting
    if (sortBy) {
      results.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (sortOrder === 'asc') {
          return (aVal as any) > (bVal as any) ? 1 : -1;
        } else {
          return (aVal as any) < (bVal as any) ? 1 : -1;
        }
      });
    }

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    
    const paginatedData = results.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  // Search functionality
  async search(tableName: string, searchTerm: string, fields: string[]): Promise<any[]> {
    if (!this.data[tableName] || !searchTerm) {
      return [];
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return this.data[tableName].filter((item: any) => {
      return fields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerSearchTerm);
        }
        return false;
      });
    });
  }

  // Database statistics
  getStats(): { [tableName: string]: number } {
    const stats: { [key: string]: number } = {};
    Object.keys(this.data).forEach(tableName => {
      stats[tableName] = this.data[tableName]?.length || 0;
    });
    return stats;
  }

  // Backup functionality
  async createBackup(): Promise<string> {
    const backupDir = path.join(path.dirname(this.dbPath), 'backups');
    if (!fs.existsSync(backupDir)) {
      await mkdir(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.json`);
    
    await writeFile(backupPath, JSON.stringify(this.data, null, 2));
    
    logger.info('Database backup created', { backupPath });
    return backupPath;
  }

  // Restore from backup
  async restoreFromBackup(backupPath: string): Promise<void> {
    try {
      const backupData = await readFile(backupPath, 'utf-8');
      this.data = JSON.parse(backupData);
      await this.saveToFile();
      
      logger.info('Database restored from backup', { backupPath });
    } catch (error) {
      logger.error('Failed to restore from backup', error);
      throw error;
    }
  }

  // Close database connection (for graceful shutdown)
  async close(): Promise<void> {
    try {
      await this.saveToFile();
      logger.info('Database connection closed gracefully');
    } catch (error) {
      logger.error('Error closing database connection', error);
    }
  }

  // Clean up old records
  async cleanup(tableName: string, olderThanDays: number = 30): Promise<number> {
    if (!this.data[tableName]) {
      return 0;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const originalLength = this.data[tableName].length;
    this.data[tableName] = this.data[tableName].filter((item: any) => {
      const createdAt = new Date(item.createdAt);
      return createdAt > cutoffDate;
    });

    const removedCount = originalLength - this.data[tableName].length;
    
    if (removedCount > 0) {
      await this.saveToFile();
      logger.info(`Cleaned up ${removedCount} old records from ${tableName}`);
    }

    return removedCount;
  }
}

export default DatabaseManager; 