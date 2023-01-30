import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seed() {
  await prisma.user.deleteMany();
  await prisma.guestbook.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        id: "1",
        name: "Danger Dan",
        email: "danger@dan.danger",
        image: "https://i.imgur.com/8Q5ZQqS.jpg",
      },
      {
        id: "2",
        name: "Urzuk the Wise",
        email: "urzuk@orks.org",
        image: "https://i.imgur.com/8Q5ZQqS.jpg",
      },
    ],
  });
  await prisma.guestbook.createMany({
    data: [
      {
        name: "Danger Dan",
        message: "Hello World, I am Danger Dan.",
        userId: "1",
        createdAt: new Date(),
      },
      {
        name: "Urzuk the Wise",
        message: "Urzuk the Wise is here to help.",
        userId: "2",
        createdAt: new Date(),
      },
    ],
  });
}
seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
