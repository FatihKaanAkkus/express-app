import type { Request, Response, NextFunction } from 'express';
import { fromError } from 'zod-validation-error';
import { loginSchema, registerSchema } from '@/validators/auth-schema';

export default {
  /**
   * Returns a middleware that validates the request body for user registration.
   */
  register: () => {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromError(result.error);
        res.status(400).json({ message: validationError.toString() });
        return;
      }

      req.body = result.data;
      next();
    };
  },

  /**
   * Returns a middleware that validates the request body for user login.
   */
  login: () => {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromError(result.error);
        res.status(400).json({ message: validationError.toString() });
        return;
      }

      req.body = result.data;
      next();
    };
  },
};
