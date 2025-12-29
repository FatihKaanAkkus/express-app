import type { Request, Response, NextFunction } from 'express';
import passport from '@/config/passport';
import { User } from '@/database/prisma-client';

export default {
  /**
   * Returns a middleware that guards routes for authenticated users only.
   */
  require: () => {
    return passport.authenticate('jwt', { session: false, failWithError: true });
  },

  /**
   * Returns a middleware that checks if the authenticated user owns the resource.
   */
  role: (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const loggedInUser = req.user as User;
      const { userId } = req.params as { userId: string };

      // Allow if user has required role
      if (allowedRoles.includes(loggedInUser.role)) {
        return next();
      }

      // Allow if user is owner
      if (allowedRoles.includes('owner') && loggedInUser.id === userId) {
        req.authOwner = true;
        return next();
      }

      return res.status(403).json({ error: 'Forbidden' });
    };
  },
};
