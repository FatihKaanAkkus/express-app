import { Request, Response } from 'express';
import prisma from '@/database/prisma-client';
import { CreateUserSchema } from '@/validators/user-schemas';
import cache from '@/config/cache';
import { keys } from '@/helpers/cache-keys';

/**
 * Indexes all users in the database.
 */
export async function indexUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  await cache.set(res.locals.cacheKey as string, users);

  res.status(200).json(users);
}

/**
 * Creates a new user in the database.
 * Invalidates the user index cache after successfull operation.
 */
export async function createUser(req: Request, res: Response) {
  const { email, name } = req.body as CreateUserSchema;

  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });

  await cache.del(keys.user.index()); // <-- Invalidate the cache

  res.status(201).send(user);
}

/**
 * Shows a specific user by ID.
 */
export async function showUser(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
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
}
