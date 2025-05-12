import type { Request, Response, NextFunction } from 'express';
import cache from '@/config/cache';
import { keys } from '@/helpers/cache-keys';

export default {
  indexUsers: () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const cacheKey = keys.user.index();
      const cachedUsers = await cache.get(cacheKey);
      if (cachedUsers) {
        res.status(200).json(cachedUsers);
        return;
      }

      res.locals.cacheKey = cacheKey;
      next();
    };
  },
  showUser: () => {
    return async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const cacheKey = keys.user.show(id);
      const cachedUser = await cache.get(cacheKey);
      if (cachedUser) {
        res.status(200).json(cachedUser);
        return;
      }

      res.locals.cacheKey = cacheKey;
      next();
    };
  },
};
