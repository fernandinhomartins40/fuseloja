import { DatabaseManager } from './database';
import { User, UserRole, PaginationQuery } from '../types';
import { TokenHelper } from '../utils/crypto';
import logger from '../utils/logger';

export class UserModel {
  private db: DatabaseManager;
  private tableName = 'users';

  constructor() {
    this.db = DatabaseManager.getInstance();
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const user = await this.db.insert(this.tableName, {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar || null,
        role: userData.role,
        isEmailVerified: userData.isEmailVerified || false,
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        lastLogin: null
      });

      logger.info(`User created: ${(user as any).email}`);
      return user as unknown as User;
    } catch (error) {
      logger.error('Failed to create user', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.db.findById(this.tableName, id);
      return user as unknown as User | null;
    } catch (error) {
      logger.error('Failed to find user by ID', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.db.findOne(this.tableName, { email });
      return user as unknown as User | null;
    } catch (error) {
      logger.error('Failed to find user by email', error);
      throw error;
    }
  }

  async findAll(query: PaginationQuery = {}): Promise<{ users: User[], total: number }> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
      
      const result = await this.db.findWithPagination(this.tableName, { isActive: true }, {
        page,
        limit,
        sortBy,
        sortOrder
      });

      return {
        users: result.data,
        total: result.pagination.total
      };
    } catch (error) {
      logger.error('Failed to find all users', error);
      throw error;
    }
  }

  async update(id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
    try {
      const success = await this.db.update(this.tableName, id, userData);
      if (!success) {
        return null;
      }

      const updatedUser = await this.findById(id);
      if (updatedUser) {
        logger.info(`User updated: ${updatedUser.email}`);
      }
      
      return updatedUser;
    } catch (error) {
      logger.error('Failed to update user', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const success = await this.db.update(this.tableName, id, { isActive: false });
      if (success) {
        logger.info(`User soft deleted: ${id}`);
      }
      return success;
    } catch (error) {
      logger.error('Failed to delete user', error);
      throw error;
    }
  }

  async hardDelete(id: string): Promise<boolean> {
    try {
      const success = await this.db.delete(this.tableName, id);
      if (success) {
        logger.info(`User hard deleted: ${id}`);
      }
      return success;
    } catch (error) {
      logger.error('Failed to hard delete user', error);
      throw error;
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.db.update(this.tableName, id, {
        lastLogin: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to update last login', error);
      throw error;
    }
  }

  async verifyEmail(id: string): Promise<boolean> {
    try {
      const success = await this.db.update(this.tableName, id, {
        isEmailVerified: true
      });
      
      if (success) {
        logger.info(`Email verified for user: ${id}`);
      }
      
      return success;
    } catch (error) {
      logger.error('Failed to verify email', error);
      throw error;
    }
  }

  async searchUsers(searchTerm: string, query: PaginationQuery = {}): Promise<{ users: User[], total: number }> {
    try {
      const { page = 1, limit = 10 } = query;
      
      const searchResults = await this.db.search(this.tableName, searchTerm, ['email', 'firstName', 'lastName']);
      
      // Apply pagination to search results
      const total = searchResults.length;
      const offset = (page - 1) * limit;
      const users = searchResults.slice(offset, offset + limit);

      return { users, total };
    } catch (error) {
      logger.error('Failed to search users', error);
      throw error;
    }
  }

  async getUsersByRole(role: UserRole, query: PaginationQuery = {}): Promise<{ users: User[], total: number }> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
      
      const result = await this.db.findWithPagination(this.tableName, { role, isActive: true }, {
        page,
        limit,
        sortBy,
        sortOrder
      });

      return {
        users: result.data,
        total: result.pagination.total
      };
    } catch (error) {
      logger.error('Failed to get users by role', error);
      throw error;
    }
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    verified: number;
    byRole: Record<UserRole, number>;
    recentRegistrations: number;
  }> {
    try {
      const allUsers = await this.db.find(this.tableName);
      const activeUsers = allUsers.filter(user => user.isActive);
      const verifiedUsers = allUsers.filter(user => user.isEmailVerified);
      
      // Count by role
      const byRole: Record<UserRole, number> = {
        [UserRole.ADMIN]: 0,
        [UserRole.USER]: 0,
        [UserRole.MODERATOR]: 0,
        [UserRole.GUEST]: 0
      };

      activeUsers.forEach(user => {
        const userRole = (user as unknown as User).role;
        if (userRole && userRole in byRole) {
          byRole[userRole as UserRole]++;
        }
      });

      // Recent registrations (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentRegistrations = allUsers.filter(user => 
        new Date(user.createdAt) > thirtyDaysAgo
      ).length;

      return {
        total: allUsers.length,
        active: activeUsers.length,
        verified: verifiedUsers.length,
        byRole,
        recentRegistrations
      };
    } catch (error) {
      logger.error('Failed to get user stats', error);
      throw error;
    }
  }
}

export default UserModel; 