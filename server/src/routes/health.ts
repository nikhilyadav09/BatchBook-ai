// server/src/routes/health.ts
import { Router, Request, Response } from 'express';
import { db } from '../lib/db';
import { logger } from '../lib/logger';

const router = Router();

// Health check endpoint
router.get('/health', async (req: Request, res: Response) => {
  try {
    const healthStatus = await db.healthCheck();
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: healthStatus,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// Database statistics endpoint
router.get('/health/db-stats', async (req: Request, res: Response) => {
  try {
    const stats = await Promise.all([
      db.getPrismaClient().user.count(),
      db.getPrismaClient().batch.count(),
      db.getPrismaClient().memory.count(),
      db.getPrismaClient().comment.count(),
      db.getPrismaClient().reaction.count(),
      db.getPrismaClient().notification.count()
    ]);

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      statistics: {
        users: stats[0],
        batches: stats[1],
        memories: stats[2],
        comments: stats[3],
        reactions: stats[4],
        notifications: stats[5],
        total_records: stats.reduce((sum, count) => sum + count, 0)
      }
    });
  } catch (error) {
    logger.error('Database stats failed:', error);
    
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Unable to fetch database statistics'
    });
  }
});

export default router;