import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const postRouter = router({
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
        await ctx.prisma.post.create({
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
      return await ctx.prisma.post.findMany({
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
          _count: {
            select: {
              likes: true,
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
        await ctx.prisma.post.delete({
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
        await ctx.prisma.post.update({
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
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.session.user.id;
      try {
        await ctx.prisma.like.create({
          data: {
            userId: userId,
            postId: id,
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
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.session.user.id;
      try {
        await ctx.prisma.like.delete({
          where: {
            postId_userId: {
              postId: id,
              userId: userId,
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error(error as string);
      }
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
        message: z.string().min(5).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, message } = input;
      const userId = ctx.session.user.id;
      try {
        await ctx.prisma.comment.create({
          data: {
            userId: userId,
            postId: postId,
            message: message,
          },
        });
      } catch (error) {
        console.log(error);
        throw new Error(error as string);
      }
    }),

  deleteComment: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      try {
        await ctx.prisma.comment.delete({
          where: { id },
        });
      } catch (error) {
        console.log(error);
        throw new Error(error as string);
      }
    }),
});
