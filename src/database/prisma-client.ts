import { PrismaClient, User, Prisma, $Enums } from '@/generated/prisma';

const prisma = new PrismaClient({
  omit: {
    user: {
      hashedPassword: true,
    },
  },
});

export default prisma;

/**
 * Exporting Prisma type and models for external use.
 */
export type { Prisma };

export const UserRoles = $Enums.Role;
export type UserRole = $Enums.Role;
export type UserModel = User;

/**
 * Exporting customized types without sensitive fields.
 */
type UserWithoutPassword = Omit<User, 'hashedPassword'>;
export { UserWithoutPassword as User };
