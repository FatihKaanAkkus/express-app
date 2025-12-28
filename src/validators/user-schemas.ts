import { UserRoles } from '@/database/prisma-client';
import { z } from 'zod';

export const indexUsersSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  perPage: z.coerce.number().min(1).optional(),
});

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(128),
  name: z.string().min(2).max(255),
  role: z.enum(Object.values(UserRoles)),
});

export const showUserSchema = z.object({
  params: z.object({
    userId: z.uuid(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    userId: z.uuid(),
  }),
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().min(2).max(255).optional(),
    password: z.string().min(6).max(128).optional(),
    role: z.enum(Object.values(UserRoles)).optional(),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.uuid(),
  }),
});

export type IndexUsersSchema = z.infer<typeof indexUsersSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type ShowUserSchema = z.infer<typeof showUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>;
