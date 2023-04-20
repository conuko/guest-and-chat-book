import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const postRouter = router({
  postMessage: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        name: z.string().min(1),
        message: z
          .string()
          .min(5, "Error. Post must be at least 5 characters long.")
          .max(100, "Error. Post can not be longer than 100 characters."),
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
          createdAt: true,
          updatedAt: true,
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
        throw new Error(error as string);
      }
    }),

  updateMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        message: z
          .string()
          .min(5, "Error. Post must be at least 5 characters long.")
          .max(100, "Error. Post can not be longer than 100 characters."),
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
        throw new Error(error as string);
      }
    }),

  getAllComments: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.comment.findMany({
        select: {
          id: true,
          userId: true,
          postId: true,
          message: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }),

  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
        message: z
          .string()
          .min(5, "Error. Comment must be at least 5 characters long.")
          .max(100, "Error. Comment can not be longer than 100 characters."),
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
        throw new Error(error as string);
      }
    }),
});
