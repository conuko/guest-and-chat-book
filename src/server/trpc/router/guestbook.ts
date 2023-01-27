import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const guestbookRouter = router({
  postMessage: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        name: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.guestbook.create({
          data: {
            userId: input.userId,
            name: input.name,
            message: input.message,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.findMany({
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
      console.log(error);
    }
  }),

  deleteMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      try {
        await ctx.prisma.guestbook.delete({
          where: { id },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  updateMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, message } = input;
      try {
        await ctx.prisma.guestbook.update({
          where: { id },
          data: { message },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
