import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(128),
  name: z.string().min(2).max(255),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(128),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
