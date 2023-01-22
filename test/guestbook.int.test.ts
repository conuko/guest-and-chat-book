import { expect, test, vi, describe, it, beforeAll, afterAll } from "vitest";
import { useSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// mock the useSession hook from next-auth to return a mock session
vi.mock("next-auth/react", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const originalModule = require("next-auth/react");

  interface User {
    name: string;
    email: string;
    image: string;
    id: string;
  }

  interface Session {
    user: User;
    expires: string;
  }

  const mockSession: Session = {
    user: {
      name: "Danger Dan",
      email: "danger@dan.danger",
      image: "https://i.imgur.com/8Q5ZQqS.jpg",
      id: "1",
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

// create some test data before each test that will be deleted after each test
beforeAll(async () => {
  await prisma.$connect();

  await prisma.guestbook.createMany({
    data: [
      {
        name: "Danger Dan",
        message: "You are in danger! Danger Dan is here to help.",
        userId: "1",
        createdAt: new Date(),
      },
      {
        name: "Urzuk the Wise",
        message: "This is a test message from Urzuk the Wise.",
        userId: "2",
        createdAt: new Date(),
      },
    ],
  });
});

// test the mocked useSession hook
describe("The mocked Auth Session", () => {
  it("should return an authenticated session", async () => {
    const { data, status } = useSession();
    expect(status).toBe("authenticated");
    expect(data?.user).toBeDefined();
    expect(data?.user?.name).toBe("Danger Dan");
    expect(data?.user?.id).toBe("1");
    expect(data?.user?.email).toBe("danger@dan.danger");
    expect(data?.user?.image).toBe("https://i.imgur.com/8Q5ZQqS.jpg");
  });
});

// test the guestbook queries
describe("The guestbook query getAll", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  it("should return all posts", async () => {
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

// test the guestbook mutations
describe("The guestbook mutation postMessage", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  it("should post a message", async () => {
    const { data } = useSession();
    const userId = data?.user?.id;
    const name = data?.user?.name;
    const message = "This is a test message. Hello World!";
    const newMessage = await prisma.guestbook.create({
      data: {
        userId: "1",
        name: "Danger Dan",
        message: message,
      },
    });
    expect(newMessage).toBeDefined();
    expect(newMessage?.name).toBe(name);
    expect(newMessage?.userId).toBe(userId);
    expect(newMessage?.message).toBe(message);
  });
});

// delete all messages after each test
afterAll(async () => {
  const deleteAllMessages = prisma.guestbook.deleteMany();
  await prisma.$transaction([deleteAllMessages]);
  await prisma.$disconnect();
});
