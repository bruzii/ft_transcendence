import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      lastName: 'Smith',
      firstName: 'Jane',
      email: 'jane.smith@example.com',
    },
  });

  const friend1 = await prisma.friend.create({
    data: {
      user: {
        connect: {
          id: user1.id,
        },
      },
      friend: {
        connect: {
          id: user2.id,
        },
      },
    },
  });

  const friend2 = await prisma.friend.create({
    data: {
      user: {
        connect: {
          id: user2.id,
        },
      },
      friend: {
        connect: {
          id: user1.id,
        },
      },
    },
  });

  console.log({ user1, user2, friend1, friend2 });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
