import { expect, test, vi, describe, it, beforeAll } from "vitest";
import { trpc } from "../src/utils/trpc";
import { useSession } from "next-auth/react";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

vi.mock("next-auth/react", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const originalModule = require("next-auth/react");
  const mockSession = {
    user: {
      name: "John Doe",
      email: "john@doe.com",
      image: "https://example.com/image.png",
    },
    expires: "1",
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: vi.fn(() => {
      return { data: mockSession, status: "authenticated" };
    }),
  };
});

describe("The mocked Auth Session", () => {
  it("should return an authenticated session", async () => {
    const { data, status } = useSession();
    expect(status).toBe("authenticated");
    expect(data?.user).toBeDefined();
    expect(data?.user?.name).toBe("John Doe");
    expect(data?.user?.email).toBe("john@doe.com");
    expect(data?.user?.image).toBe("https://example.com/image.png");
  });
});

// Write test cases for the guestbook endpoint here
describe("The guestbook query getAll", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  it("should return all posts", async () => {
    //const posts = await trpc.router.query("guestbook.getAll");
    const messages = await prisma.guestbook.findMany({
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
    expect(messages).toBeDefined();
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0]?.name).toBeDefined();
    expect(messages[0]?.message).toBeDefined();
  });
});
