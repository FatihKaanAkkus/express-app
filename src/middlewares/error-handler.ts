import env from '@/config/env';
import type { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.status || 500;
  const message = err.message || 'An unexpected error occurred.';

  console.error(`[Error] ${message}`);

  res.status(statusCode).json({
    error: 'An error occurred',
    message: env.NODE_ENV === 'development' ? message : 'Internal Server Error',
  });
};

export default errorHandler;
