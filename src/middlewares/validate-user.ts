import type { Request, Response, NextFunction } from 'express';
import { createUserSchema, deleteUserSchema, indexUsersSchema, updateUserSchema } from '@/validators/user-schemas';
import { fromError } from 'zod-validation-error';

export default {
  /**
   * Returns a middleware that validates the request query for indexing users.
   */
  index: () => {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = indexUsersSchema.safeParse(req.query);
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
   * Returns a middleware that validates the request body for creating a user.
   */
  create: () => {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = createUserSchema.safeParse(req.body);
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
   * Returns a middleware that validates the request params for showing a user.
   */
  show: () => {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = deleteUserSchema.safeParse({ params: req.params });
      if (!result.success) {
        const validationError = fromError(result.error);
        res.status(400).json({ message: validationError.toString() });
        return;
      }

      req.params = result.data.params;
      next();
    };
  },

  /**
   * Returns a middleware that validates the request params and body for updating a user.
   */
  update: () => {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = updateUserSchema.safeParse({ params: req.params, body: req.body });
      if (!result.success) {
        const validationError = fromError(result.error);
        res.status(400).json({ message: validationError.toString() });
        return;
      }

      req.params = result.data.params;
      req.body = result.data.body;
      next();
    };
  },

  /**
   * Returns a middleware that validates the request params for deleting a user.
   */
  delete: () => {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = deleteUserSchema.safeParse({ params: req.params });
      if (!result.success) {
        const validationError = fromError(result.error);
        res.status(400).json({ message: validationError.toString() });
        return;
      }

      req.params = result.data.params;
      next();
    };
  },
};
