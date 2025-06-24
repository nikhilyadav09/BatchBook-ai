// server/src/lib/db.ts
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Global Prisma instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create Prisma client with proper configuration
export const prisma = globalThis.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
});

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Connection management
export class DatabaseManager {
  private static instance: DatabaseManager;
  private prismaClient: PrismaClient;

  private constructor() {
    this.prismaClient = prisma;
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async connect(): Promise<void> {
    try {
      await this.prismaClient.$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.prismaClient.$disconnect();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Database disconnection failed:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    try {
      await this.prismaClient.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Database health check failed:', error);
      throw new Error('Database health check failed');
    }
  }

  getPrismaClient(): PrismaClient {
    return this.prismaClient;
  }
}

// Error handling wrapper
export const handleDatabaseError = (error: any) => {
  logger.error('Database error:', error);
  
  if (error.code === 'P2002') {
    return new Error('A record with this information already exists');
  }
  
  if (error.code === 'P2025') {
    return new Error('Record not found');
  }
  
  if (error.code === 'P2003') {
    return new Error('Related record not found');
  }
  
  if (error.code === 'P2014') {
    return new Error('Invalid data provided');
  }
  
  return new Error('Database operation failed');
};

// Query helpers
export class QueryHelpers {
  static buildPagination(page: number = 1, limit: number = 10) {
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }

  static buildDateFilter(startDate?: Date, endDate?: Date) {
    if (!startDate && !endDate) return {};
    
    return {
      createdAt: {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      },
    };
  }

  static buildSearchFilter(searchTerm?: string, fields: string[] = []) {
    if (!searchTerm) return {};
    
    return {
      OR: fields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive' as const,
        },
      })),
    };
  }

  static buildSortOrder(sortBy: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') {
    return {
      [sortBy]: sortOrder,
    };
  }
}

// Transaction wrapper
export const executeTransaction = async <T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> => {
  try {
    return await prisma.$transaction(async (tx) => {
      return await operation(tx);
    });
  } catch (error) {
    throw handleDatabaseError(error);
  }
};

// Batch operations helper
export class BatchOperations {
  static async batchCreate<T>(
    model: any,
    data: any[],
    batchSize: number = 100
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(item => model.create({ data: item }))
      );
      results.push(...batchResults);
    }
    
    return results;
  }

  static async batchUpdate<T>(
    model: any,
    updates: { where: any; data: any }[],
    batchSize: number = 100
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(update => model.update(update))
      );
      results.push(...batchResults);
    }
    
    return results;
  }
}

// Export the singleton instance
export const db = DatabaseManager.getInstance();