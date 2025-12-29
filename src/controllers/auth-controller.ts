import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import env from '@/config/env';
import passport from '@/config/passport';
import { userIndexCache } from '@/config/cache';
import { authOperationsCounter, cacheCounter } from '@/config/metrics';
import { httpErrors } from '@/helpers/errors';
import userService from '@/services/user-service';
import { RegisterSchema } from '@/validators/auth-schema';
import { User } from '@/database/prisma-client';

/**
 * Registers a new user.
 */
export async function register(req: Request, res: Response) {
  authOperationsCounter.inc({ operation: 'register' });

  const body = req.body as RegisterSchema;

  const user = await userService.createUser(body);

  await userIndexCache.clear(); // <-- Invalidate the index cache

  cacheCounter.inc({ operation: 'del' });

  res.status(201).json(user);
}

/**
 * Logs in a user and returns a JWT access token.
 */
export async function login(req: Request, res: Response, next: Function) {
  passport.authenticate('local', { session: false, failWithError: true }, (err: Error, user: User | false) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, env.get<string>('JWT_SECRET')!, {
      expiresIn: '1h',
      issuer: env.get<string>('JWT_ISSUER'),
      audience: env.get<string>('JWT_AUDIENCE'),
    });

    res.json({ accessToken, user });
  })(req, res, next);
}

/**
 * Returns the profile of the authenticated user.
 * Guarded by authentication middleware.
 */
export async function profile(req: Request, res: Response) {
  authOperationsCounter.inc({ operation: 'profile' });

  const user = req.user;
  if (user) {
    return res.status(200).json(user);
  }

  throw httpErrors.InternalServerError('User not found in request');
}
