import env from '@/config/env';
import type { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

/**
 * Returns a middleware for the global error handling.
 */
export default () => {
  return (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.status || 500;
    const error = err.name || 'Error';
    const message = err.message || 'Internal Server Error';

    if (env.get<string>('NODE_ENV', 'production') === 'development') {
      console.error(`[Error] ${req.traceId} ${message}`, err.stack);
    }

    res.status(statusCode).json({
      error: error,
      message: message,
      stack: env.get<string>('NODE_ENV', 'production') === 'development' ? err.stack : undefined,
    });
  };
};
