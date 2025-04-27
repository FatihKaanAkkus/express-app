import prisma from '@/database/prisma-client';
import { faker } from '@faker-js/faker';

export default async function main() {
  const list = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    email: faker.internet.email({ provider: 'fkakkus.com' }),
    name: faker.person.fullName(),
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
