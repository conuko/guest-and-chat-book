import { expect, test, vi } from "vitest"; // 👈🏻 Added the `vi` import
import { postMessage } from "../libs/__mocks__/guestbook";
import prisma from "../libs/__mocks__/prisma";

vi.mock("../libs/prisma");

test("postMessage with valid input should return the generated message", async () => {
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
