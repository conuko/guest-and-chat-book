import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx;

    if (!session.user?.id) {
      throw new Error("Not authenticated");
    }

    const data = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
      select: {
        stripeSubscriptionStatus: true,
      },
    });

    if (!data) {
      throw new Error("Could not find user");
    }

    return data.stripeSubscriptionStatus;
  }),
  addUserAddress: protectedProcedure
    .input(
      z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        zip: z.string().min(1),
        country: z.string().min(1),
        phone: z.string().min(4),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      try {
        await prisma.userAddress.create({
          data: {
            userId: session.user?.id,
            street: input.street,
            city: input.city,
            zip: input.zip,
            country: input.country,
            phone: input.phone,
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error(error as string);
      }
    }),
  getUserAddress: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx;
    try {
      return await prisma.userAddress.findMany({
        where: {
          userId: session.user?.id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }),
});
