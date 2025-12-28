import env from '@/config/env';
import type { Request, Response, NextFunction } from 'express';
import cache, { userIndexCache } from '@/config/cache';
import { keys } from '@/helpers/cache-keys';
import { cacheCounter } from '@/config/metrics';

export default {
  /**
   * Returns a middleware that checks for cached user index results.
   */
  indexUsers: () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const cacheKey = keys.user.index(req.url);
      const cachedUsers = await userIndexCache.get(cacheKey);

      if (cachedUsers) {
        cacheCounter.inc({ operation: 'get', result: 'hit' });

        if (env.get<string>('NODE_ENV', 'production') === 'development') {
          console.log(`[Cache] ${req.traceId} : Cache hit for user ${cacheKey}`);
        }

        res.status(200).json(cachedUsers);
        return;
      }

      cacheCounter.inc({ operation: 'get', result: 'miss' });

      res.locals.cacheKey = cacheKey;
      next();
    };
  },

  /**
   * Returns a middleware that checks for cached individual user data.
   */
  showUser: () => {
    return async (req: Request<{ userId: string }>, res: Response, next: NextFunction) => {
      const cacheKey = keys.user.show(req.params.userId);
      const cachedUser = await cache.get(cacheKey);

      if (cachedUser) {
        if (env.get<string>('NODE_ENV', 'production') !== 'test') {
          console.log(`[Cache] ${req.traceId} : Cache hit for ${cacheKey}`);
        }

        cacheCounter.inc({ operation: 'get', result: 'hit' });

        res.status(200).json(cachedUser);
        return;
      }

      cacheCounter.inc({ operation: 'get', result: 'miss' });

      res.locals.cacheKey = cacheKey;
      next();
    };
  },
};
