import { Request, Response } from 'express';
import prisma from '@/database/prisma-client';
import { CreateUserSchema } from '@/validators/user-schemas';
import cache from '@/config/cache';
import { keys } from '@/helpers/cache-keys';
import { userOperationsCounter } from '@/config/metrics';

/**
 * Indexes all users in the database.
 */
export const indexUsers = async (req: Request, res: Response) => {
  userOperationsCounter.inc({ operation: 'index' });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  await cache.set(res.locals.cacheKey as string, users);

  res.status(200).json(users);
};

/**
 * Creates a new user in the database.
 * Invalidates the user index cache after successful operation.
 */
export const createUser = async (req: Request, res: Response) => {
  userOperationsCounter.inc({ operation: 'create' });

  const { email, name } = req.body as CreateUserSchema;

  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });

  await cache.del(keys.user.index()); // <-- Invalidate the cache

  res.status(201).send(user);
};

/**
 * Shows a specific user by ID.
 */
export const showUser = async (req: Request<{ id: string }>, res: Response) => {
  userOperationsCounter.inc({ operation: 'show' });

  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  await cache.set(res.locals.cacheKey, user);

  res.status(200).json(user);
};
