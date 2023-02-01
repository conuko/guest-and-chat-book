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
  id: z.string().optional(),
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
  try {
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
  } catch (error) {
    return new Error("No messages found");
  }
}

export async function deleteMessage(id: string) {
  try {
    return await prisma.guestbook.delete({
      where: { id },
    });
  } catch (error) {
    return new Error("Message not found");
  }
}

export async function updateMessage({
  id,
  message,
}: {
  id: string;
  message: string;
}) {
  try {
    return await prisma.guestbook.update({
      where: { id },
      data: { message },
    });
  } catch (error) {
    return new Error("Message not found");
  }
}
