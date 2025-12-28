import prisma, { UserRoles, type UserModel } from '@/database/prisma-client';
import { faker } from '@faker-js/faker';

export default async function main() {
  const list: UserModel[] = Array.from({ length: 5 }, (_, i) => ({
    id: faker.string.uuid(),
    email: faker.internet.email({ provider: 'fkakkus.com' }),
    hashedPassword: faker.internet.password(),
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(Object.values(UserRoles)),
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
