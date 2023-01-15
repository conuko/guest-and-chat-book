import prisma from "./prisma";

interface Guestbook {
  id?: string;
  name: string;
  message: string;
  userId: string;
  createdAt?: Date;
}

export async function postMessage(guestbook: Guestbook) {
  return await prisma.guestbook.create({
    data: guestbook,
  });
}

export async function getAll() {
  return await prisma.guestbook.findMany({
    select: {
      id: true,
      name: true,
      userId: true,
      message: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteMessage(id: string) {
  return await prisma.guestbook.delete({
    where: { id },
  });
}

export async function updateMessage({
  id,
  message,
}: {
  id: string;
  message: string;
}) {
  return await prisma.guestbook.update({
    where: { id },
    data: { message },
  });
}
