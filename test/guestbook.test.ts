import { expect, test, vi } from "vitest"; // 👈🏻 Added the `vi` import
import {
  postMessage,
  getAll,
  deleteMessage,
  updateMessage,
} from "../libs/__mocks__/guestbook";
import prisma from "../libs/__mocks__/prisma";

vi.mock("../libs/prisma");

test("postMessage mutation with valid input should return the generated message", async () => {
  const newMessage = {
    userId: "1",
    name: "Prisma Fan",
    message: "Hello World",
    createdAt: new Date(),
  };
  prisma.guestbook.create.mockResolvedValue({ ...newMessage, id: "1" });
  const message = await postMessage(newMessage);
  expect(message).toStrictEqual({ ...newMessage, id: "1" });
});

test("postMessage mutation with invalid input should throw an error", async () => {
  const newMessage = {
    userId: "1",
    name: "Prisma Fan",
    message: "Hello World",
    createdAt: new Date(),
  };
  prisma.guestbook.create.mockRejectedValue(new Error("Invalid input"));
  await expect(postMessage(newMessage)).rejects.toThrow("Invalid input");
});

test("getAll query should return all messages", async () => {
  const messages = [
    {
      id: "1",
      userId: "1",
      name: "Prisma Fan",
      message: "Hello World",
      createdAt: new Date(),
    },
    {
      id: "2",
      userId: "2",
      name: "Prisma Fan",
      message: "Hello World",
      createdAt: new Date(),
    },
  ];
  prisma.guestbook.findMany.mockResolvedValue(messages);
  const allMessages = await getAll();
  expect(allMessages).toStrictEqual(messages);
});

test("deleteMessage mutation with valid input should delete the message", async () => {
  const message = {
    id: "1",
    userId: "1",
    name: "Prisma Fan",
    message: "Hello World",
    createdAt: new Date(),
  };
  prisma.guestbook.delete.mockResolvedValue(message);
  const deletedMessage = await deleteMessage({ id: message.id });
  expect(deletedMessage).toStrictEqual(message);
});

test("deleteMessage mutation with invalid input should throw an error", async () => {
  prisma.guestbook.delete.mockRejectedValue(new Error("Invalid input"));
  await expect(deleteMessage({ id: "1" })).rejects.toThrow("Invalid input");
});

// update message test
test("updateMessage mutation with valid input should update the message", async () => {
  const message = {
    id: "1",
    userId: "1",
    name: "Prisma Fan",
    message: "Hello to the new World",
    createdAt: new Date(),
  };
  prisma.guestbook.update.mockResolvedValue(message);
  const updatedMessage = await updateMessage({
    id: message.id,
    message: message.message,
  });
  expect(updatedMessage).toStrictEqual({
    id: "1",
    userId: "1",
    name: "Prisma Fan",
    message: "Hello to the new World",
    createdAt: new Date(),
  });
});
