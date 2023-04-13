import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const regexZip = /^[0-9]{5}$/;
const regexPhone =
  /^\+49(?:\d{8,11}|\(\d{1,6}\)\d{1,10}|\d{1,6}-\d{1,10}|\d{1,6}\s\d{1,10})$/;

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
        street: z.string().min(2),
        city: z.string().min(2),
        zip: z
          .string()
          .min(2)
          .regex(regexZip, "Must be a valid german zip code"),
        country: z.string().min(2),
        phone: z
          .string()
          .min(4)
          .regex(
            regexPhone,
            "Must be a valid german phone number with country code +49"
          ),
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
        throw new Error(error as string);
      }
    }),

  getUserAddress: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx;
    try {
      return await prisma.userAddress.findFirst({
        where: {
          userId: session.user?.id,
        },
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }),

  updateUserAddress: protectedProcedure
    .input(
      z.object({
        street: z.string().min(2),
        city: z.string().min(2),
        zip: z
          .string()
          .min(2)
          .regex(regexZip, "Must be a valid german zip code"),
        country: z.string().min(2),
        phone: z
          .string()
          .min(4)
          .regex(
            regexPhone,
            "Must be a valid german phone number with country code +49"
          ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      try {
        await prisma.userAddress.update({
          where: {
            userId: session.user?.id,
          },
          data: {
            street: input.street,
            city: input.city,
            zip: input.zip,
            country: input.country,
            phone: input.phone,
          },
        });
      } catch (error) {
        throw new Error(error as string);
      }
    }),
});
