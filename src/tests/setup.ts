import prisma from '@/database/prisma-client';
import { afterAll, beforeAll } from 'vitest';
import cleanUpUserRoutesTest from './routes/user-routes.test';

beforeAll(() => {});

afterAll(async () => {
  // Call the cleanup functions if needed
  await cleanUpUserRoutesTest();

  await prisma.$disconnect();
});
