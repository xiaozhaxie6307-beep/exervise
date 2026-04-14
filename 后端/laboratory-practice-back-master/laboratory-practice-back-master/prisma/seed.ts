import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.user.deleteMany();

  console.log('Seeding...');

  const user1 = await prisma.user.create({
    data: {
      uuid: '0c19756e-6cdb-4209-b92a-9272444a3f0a',
      identificationCard: '230705199911050222',
      username: 'tian',
      realname: '赵天诚',
      password: '$2b$10$g1eFjZyQPs.d/9xGfDY4o.t15GPQjV8pYLbzrzgnIpq2ujULiwor2', // 12345678
      isAdmin: false,
      isEnable: false,
      role: 'USER',
    },
  });
  const user2 = await prisma.user.create({
    data: {
      uuid: '78f2c831-a546-4bb8-b6b6-a7fa2e40de07',
      identificationCard: '230705199911050222',
      username: 'admin',
      realname: 'tian',
      role: 'ADMIN',
      isAdmin: true,
      isEnable: true,
      password: '$2b$10$g1eFjZyQPs.d/9xGfDY4o.t15GPQjV8pYLbzrzgnIpq2ujULiwor2', // 12345678
    },
  });

  const scaleType = await prisma.scaleType.create({
    data: {
      uuid: 'e16a31a9-96c7-4fa7-8cd7-62912d207b83',
      name: '量表测试类型1',
    },
  });

  const scale = await prisma.scale.create({
    data: {
      uuid: '2bc474ae-d683-46f8-a7e1-7148004008b1',
      name: '测试量表',
      scacleCode: 'TEST',
      isFactor: true,
      isSkip: true,
      isEnable: true,
      isTeam: true,
      isComprehensiveReport: false,
      warnGender: 0,
      users: {
        create: [
          {
            user: {
              connect: {
                id: 1,
              },
            },
          },
          {
            user: {
              connect: {
                id: 2,
              },
            },
          },
        ],
      },
      scaleTypeId: 1,
    },
  });

  const s = await prisma.mergeUserScale.findMany({
    where: {
      scale: {
        id: {
          in: [1],
        },
      },
    },
  });

  console.log({ user1, user2, scaleType, scale, s });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
