import { expect, vi, describe, it, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
let userId = "";

// Mock the useSession hook from next-auth to return a mock session
vi.mock("next-auth/react", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const originalModule = require("next-auth/react");

  return {
    __esModule: true,
    ...originalModule,
    useSession: vi.fn(() => {
      const mockSession = {
        user: {
          name: "John Doe",
          email: `${userId}@doe.com`,
          image: "https://example.com/john.jpg",
          id: userId,
        },
        expires: "1",
      };

      return { data: mockSession, status: "authenticated" };
    }),
  };
});

// Create some test data before each test that will be deleted after each test
beforeAll(async () => {
  await prisma.$connect();

  userId = uuidv4();

  await prisma.user.create({
    data: {
      id: userId,
      name: "John Doe",
      email: `${userId}@doe.com`,
      image: "https://example.com/john.jpg",
      stripeSubscriptionStatus: "active",
    },
  });
});

// Test the mocked useSession hook
describe("The mocked Auth Session", () => {
  it("should return an authenticated session", async () => {
    const { data, status } = useSession();
    expect(status).toBe("authenticated");
    expect(data?.user).toBeDefined();
    expect(data?.user?.name).toBe("John Doe");
    expect(data?.user?.id).toBe(userId);
    expect(data?.user?.email).toBe(`${userId}@doe.com`);
    expect(data?.user?.image).toBe("https://example.com/john.jpg");
  });
});

// Test the user queries
describe("The user query subscriptionStatus", () => {
  it("should return the subscription status of a user", async () => {
    const { data } = useSession();
    const userId = data?.user?.id;

    const subscriptionStatus = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeSubscriptionStatus: true },
    });

    expect(subscriptionStatus).toBeDefined();
    expect(subscriptionStatus?.stripeSubscriptionStatus).toBe("active");
  });
});

describe("The user mutation addUserAddress", () => {
  it("should add a user address", async () => {
    const { data } = useSession();
    const userId = data?.user?.id;

    const userAddress = await prisma.userAddress.create({
      data: {
        userId: userId as string,
        street: "Main St",
        city: "Berlin",
        zip: "10115",
        country: "Germany",
        phone: "+49123456789",
      },
    });

    expect(userAddress).toBeDefined();
    expect(userAddress.street).toBe("Main St");
    expect(userAddress.city).toBe("Berlin");
    expect(userAddress.zip).toBe("10115");
    expect(userAddress.country).toBe("Germany");
    expect(userAddress.phone).toBe("+49123456789");
  });
});

// delete userAddress, userSession, and user after each test
afterAll(async () => {
  const { data } = useSession();
  const userId = data?.user?.id;

  await prisma.userAddress.deleteMany({ where: { userId: userId } });
  await prisma.session.deleteMany({ where: { userId: userId } });
  await prisma.user.delete({ where: { id: userId } });

  await prisma.$disconnect();
});
