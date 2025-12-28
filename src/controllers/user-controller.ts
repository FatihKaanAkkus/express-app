import type { Request, Response } from 'express';

import cache, { userIndexCache } from '@/config/cache';
import { cacheCounter, userOperationsCounter } from '@/config/metrics';
import { httpErrors } from '@/helpers/errors';
import { keys } from '@/helpers/cache-keys';
import userService from '@/services/user-service';
import {
  CreateUserSchema,
  DeleteUserSchema,
  IndexUsersSchema,
  ShowUserSchema,
  UpdateUserSchema,
} from '@/validators/user-schemas';

/**
 * Indexes all users in the database.
 */
export async function indexUsers(req: Request, res: Response) {
  userOperationsCounter.inc({ operation: 'index' });

  const query = req.body as IndexUsersSchema;

  const users = await userService.listUsers(query);

  await userIndexCache.set(res.locals.cacheKey as string, users);

  cacheCounter.inc({ operation: 'set' });

  res.status(200).json(users);
}

/**
 * Creates a new user in the database.
 * Invalidates the user index cache after successful operation.
 */
export async function createUser(req: Request, res: Response) {
  userOperationsCounter.inc({ operation: 'create' });

  const { email, password, name, role } = req.body as CreateUserSchema;

  const user = await userService.createUser({ email, password, name, role });

  await userIndexCache.clear(); // <-- Invalidate the index cache

  cacheCounter.inc({ operation: 'del' });

  res.status(201).send(user);
}

/**
 * Shows a specific user by ID.
 */
export async function showUser(req: Request, res: Response) {
  userOperationsCounter.inc({ operation: 'show' });

  const params = req.params as ShowUserSchema['params'];

  const user = await userService.getUserById(params.userId);
  if (!user) {
    throw httpErrors.NotFound('User not found');
  }

  await cache.set(res.locals.cacheKey, user);

  cacheCounter.inc({ operation: 'set' });

  res.status(200).json(user);
}

/**
 * Updates a specific user by ID.
 */
export async function updateUser(req: Request, res: Response) {
  userOperationsCounter.inc({ operation: 'update' });

  const { userId } = req.params as ShowUserSchema['params'];
  const { email, password, name, role } = req.body as UpdateUserSchema['body'];

  const payload = req.authOwner ? { email, name, password } : { email, name, password, role };
  const user = await userService.updateUser(userId, payload);

  cache.del(keys.user.show(userId)); // <-- Invalidate the cache

  cacheCounter.inc({ operation: 'del' });

  res.status(200).json(user);
}

/**
 * Deletes a specific user by ID.
 */
export async function deleteUser(req: Request<{ userId: string }>, res: Response) {
  userOperationsCounter.inc({ operation: 'delete' });

  const params = req.params as DeleteUserSchema['params'];

  const user = await userService.deleteUser(params.userId);

  cache.del(keys.user.show(params.userId)); // <-- Invalidate the cache
  userIndexCache.clear(); // <-- Invalidate the index cache

  cacheCounter.inc({ operation: 'del' });

  res.status(204).json(user);
}
