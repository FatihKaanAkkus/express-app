import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import env from '@/config/env';
import prisma from '@/database/prisma-client';

/**
 * Local Strategy for username/password authentication.
 */
passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        omit: { hashedPassword: false },
      });
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const match = await bcrypt.compare(password, user.hashedPassword);
      if (!match) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const { hashedPassword, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error);
    }
  })
);

/**
 * JWT Strategy for route authorization.
 */
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.get<string>('JWT_SECRET', ''),
      issuer: env.get<string>('JWT_ISSUER', ''),
      audience: env.get<string>('JWT_AUDIENCE', ''),
    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.sub },
        });
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
