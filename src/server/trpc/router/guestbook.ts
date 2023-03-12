import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const guestbookRouter = router({
  postMessage: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        name: z.string().min(1),
        message: z.string().min(5).max(100),
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
        throw new Error(error as string);
      }
    }),

  getAllMessages: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.findMany({
        select: {
          id: true,
          name: true,
          userId: true,
          message: true,
          likes: {
            where: {
              userId: ctx.session.user.id,
            },
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
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
        throw new Error(error as string);
      }
    }),

  updateMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        message: z.string().min(5).max(100),
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
        throw new Error(error as string);
      }
    }),

  likeMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.session.user.id;
      try {
        await ctx.prisma.like.create({
          data: {
            userId: userId,
            guestbookId: id,
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error(error as string);
      }
    }),

  unlikeMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.session.user.id;
      try {
        await ctx.prisma.like.delete({
          where: {
            guestbookId_userId: {
              guestbookId: id,
              userId: userId,
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error(error as string);
      }
    }),
});
