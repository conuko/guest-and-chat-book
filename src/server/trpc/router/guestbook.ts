import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const guestbookRouter = router({
  /* 
  A tRPC mutation that uses zod to validate the input and has an async
  function that runs a single prisma query to create a new row in the Guestbook table.
  */
  postMessage: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.guestbook.create({
          data: {
            name: input.name,
            message: input.message,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  // Query to get all messages from the guestbook
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.findMany({
        select: {
          name: true,
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
});