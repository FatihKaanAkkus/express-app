import prisma from '@/database/prisma-client';
import { faker } from '@faker-js/faker';

export default async function main() {
  const list = Array.from({ length: 5 }, (_, i) => ({
    id: faker.string.uuid(),
    email: faker.internet.email({ provider: 'fkakkus.com' }),
    name: faker.person.fullName(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));

  for (const user of list) {
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      update: {},
      create: {
        ...user,
      },
    });
  }
}
