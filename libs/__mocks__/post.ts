import prisma from "./prisma";
import { z } from "zod";

interface Post {
  id?: string;
  name: string;
  message: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  message: z.string().min(5).max(100),
  userId: z.string(),
});

export async function postMessage(post: Post) {
  try {
    return await prisma.post.create({
      data: {
        name: postSchema.parse(post).name,
        message: postSchema.parse(post).message,
        userId: postSchema.parse(post).userId,
      },
    });
  } catch (error) {
    return new Error("Invalid input");
  }
}

export async function getAllMessages() {
  try {
    return await prisma.post.findMany({
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
    return await prisma.post.delete({
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
    return await prisma.post.update({
      where: { id },
      data: { message },
    });
  } catch (error) {
    return new Error("Message not found");
  }
}

export async function likeMessage({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    return await prisma.like.create({
      data: {
        userId: userId,
        postId: id,
      },
    });
  } catch (error) {
    return new Error("Message not found");
  }
}

export async function unlikeMessage({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    return await prisma.like.delete({
      where: {
        postId_userId: {
          postId: id,
          userId: userId,
        },
      },
    });
  } catch (error) {
    return new Error("Message not found");
  }
}
