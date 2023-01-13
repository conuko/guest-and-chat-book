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
