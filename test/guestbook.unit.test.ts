/* 
This are unit tests for the functions of the post trpc endpoint.
The functions are mocked using vitest's vi.mock() function.
The mocked functions are imported from the __mocks__ folder.
For more information about unit testing and mocking with prisma and vitest, see:
https://vitest.dev/guide/mocking.html#cheat-sheet
https://www.prisma.io/docs/guides/testing/unit-testing
https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
*/

import { expect, test, vi } from "vitest";
import {
  postMessage,
  getAllMessages,
  deleteMessage,
  updateMessage,
} from "../libs/__mocks__/post";
import prismaMock from "../libs/__mocks__/prisma";

vi.mock("../libs/prisma");

test("postMessage mutation with valid input should return the generated message", async () => {
  const newMessage = {
    userId: "1",
    name: "Prisma Fan",
    message: "Hello World",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  prismaMock.post.create.mockResolvedValue({ ...newMessage, id: "1" });
  const message = await postMessage(newMessage);
  expect(message).toStrictEqual({ ...newMessage, id: "1" });
});

test("postMessage mutation with invalid input should throw an error", async () => {
  const newMessage = {
    userId: "1",
    name: "Prisma Fan",
    message: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  prismaMock.post.create.mockRejectedValue(new Error("Invalid input"));
  await expect(postMessage(newMessage)).resolves.toEqual(
    new Error("Invalid input")
  );
});

test("getAllMessages query should return all messages", async () => {
  const messages = [
    {
      id: "1",
      userId: "1",
      name: "Prisma Fan",
      message: "Hello World",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      userId: "2",
      name: "Prisma Fan",
      message: "Hello World",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  prismaMock.post.findMany.mockResolvedValue(messages);
  const allMessages = await getAllMessages();
  expect(allMessages).toStrictEqual(messages);
});

test("getAllMessages query should return an error if no messages are found", async () => {
  prismaMock.post.findMany.mockRejectedValue(new Error("No messages found"));
  await expect(getAllMessages()).resolves.toEqual(
    new Error("No messages found")
  );
});

test("deleteMessage mutation with valid input should delete the message", async () => {
  const message = {
    id: "1",
    userId: "1",
    name: "Prisma Fan",
    message: "Hello World",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  prismaMock.post.delete.mockResolvedValue(message);
  const deletedMessage = await deleteMessage(message.id);
  expect(deletedMessage).toStrictEqual(message);
});

test("deleteMessage mutation with invalid input should throw an error", async () => {
  prismaMock.post.delete.mockRejectedValue(new Error("Message not found"));
  await expect(deleteMessage("3")).resolves.toEqual(
    new Error("Message not found")
  );
});

test("updateMessage mutation with valid input should update the message", async () => {
  const message = {
    id: "1",
    userId: "1",
    name: "Prisma Fan",
    message: "Hello to the new World",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  prismaMock.post.update.mockResolvedValue(message);
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
    updatedAt: new Date(),
  });
});

test("updateMessage mutation with invalid input should throw an error", async () => {
  prismaMock.post.update.mockRejectedValue(new Error("Message not found"));
  await expect(
    updateMessage({ id: "300", message: "Hello this is a failed message" })
  ).resolves.toEqual(new Error("Message not found"));
});
