import env from '@/config/env';
import type { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

export default () => {
  return (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.status || 500;
    const message = err.message || 'An unexpected error occurred.';

    console.error(`[Error] ${message}`);

    res.status(statusCode).json({
      error: 'An error occurred',
      message: env.get<string>('NODE_ENV', 'development') === 'development' ? message : 'Internal Server Error',
    });
  };
};
