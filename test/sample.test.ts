import { expect, test, vi } from "vitest"; // 👈🏻 Added the `vi` import
import { createUser } from "../script";
import prisma from "../libs/__mocks__/prisma";

vi.mock("../libs/prisma");

test("createUser should return the generated user", async () => {
  const newUser = {
    email: "user@prisma.io",
    name: "Prisma Fan",
    emailVerified: new Date(),
    image: "https://example.com/image.png",
  };
  prisma.user.create.mockResolvedValue({ ...newUser, id: "1" });
  const user = await createUser(newUser);
  expect(user).toStrictEqual({ ...newUser, id: "1" });
});
