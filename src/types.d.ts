import type { User as PrismaUser } from './database/prisma-client';

declare global {
  declare namespace Express {
    export interface User extends PrismaUser {}
    export interface Request {
      // Distributed tracing fields
      traceId: string;
      spanId: string;
      // The authenticated user
      user?: User;
      // Indicates if the authorized as 'owner' of the resource
      authOwner?: boolean;
    }
  }
}
