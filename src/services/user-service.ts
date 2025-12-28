import bcrypt from 'bcrypt';
import prisma, { type UserRole, type UserModel, UserRoles } from '@/database/prisma-client';
import { httpErrors } from '@/helpers/errors';

type User = Omit<UserModel, 'hashedPassword'>;

async function listUsers(query: { page?: number; perPage?: number }): Promise<User[]> {
  try {
    const skip = ((query.page ?? 1) - 1) * (query.perPage ?? 25);
    const take = query.perPage ?? 25;

    const users = await prisma.user.findMany({ skip, take });

    return users;
  } catch (error) {
    throw httpErrors.InternalServerError(`Failed to list users: ${(error as Error).message}`);
  }
}

async function createUser(data: { email: string; password: string; name: string; role?: UserRole }): Promise<User> {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw httpErrors.Conflict('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        hashedPassword: hashedPassword,
        name: data.name,
        role: data.role ?? UserRoles.guest,
      },
    });

    return user;
  } catch (error) {
    throw httpErrors.InternalServerError(`Failed to create user: ${(error as Error).message}`);
  }
}

async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function updateUser(
  id: string,
  data: { email?: string; password?: string; name?: string; role?: UserRole }
): Promise<User> {
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw httpErrors.NotFound('User not found');
  }

  const updateData: { email?: string; name?: string; hashedPassword?: string; role?: UserRole } = {};
  if (data.email) {
    updateData.email = data.email;
  }
  if (data.password) {
    updateData.hashedPassword = await bcrypt.hash(data.password, 10);
  }
  if (data.name) {
    updateData.name = data.name;
  }
  if (data.role) {
    updateData.role = data.role;
  }
  return prisma.user.update({
    where: { id },
    data: updateData,
  });
}

async function deleteUser(id: string): Promise<User> {
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw httpErrors.NotFound('User not found');
  }

  return prisma.user.delete({
    where: { id },
  });
}

export default { listUsers, createUser, getUserById, updateUser, deleteUser };
