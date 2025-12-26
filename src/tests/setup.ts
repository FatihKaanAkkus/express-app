import prisma from '@/database/prisma-client';
import { afterAll, beforeAll } from 'vitest';

beforeAll(async () => {
  await prisma.$executeRaw`BEGIN`;
});

afterAll(async () => {
  await prisma.$executeRaw`ROLLBACK`;
  await prisma.$disconnect();
});
