import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { httpRequestCounter, httpRequestDuration } from '@/config/metrics';

/**
 * Returns a middleware that creates trace ids and monitors incoming HTTP
 * requests and collects metrics.
 */
export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.traceId = uuidv4();
    req.spanId = uuidv4();

    const start = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route?.path || req.path;

      httpRequestCounter.inc({
        method: req.method,
        route,
        status_code: res.statusCode,
      });

      httpRequestDuration.observe(
        {
          method: req.method,
          route,
          status_code: res.statusCode,
        },
        duration
      );
    });

    next();
  };
};
