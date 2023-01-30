import prisma from "./prisma";
import { z } from "zod";

interface Guestbook {
  id?: string;
  name: string;
  message: string;
  userId: string;
  createdAt?: Date;
}

const guestbookSchema = z.object({
  name: z.string().min(1),
  message: z.string().min(5).max(100),
  userId: z.string(),
});

export async function postMessage(guestbook: Guestbook) {
  try {
    return await prisma.guestbook.create({
      data: {
        name: guestbookSchema.parse(guestbook).name,
        message: guestbookSchema.parse(guestbook).message,
        userId: guestbookSchema.parse(guestbook).userId,
      },
    });
  } catch (error) {
    return new Error("Invalid input");
  }
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
