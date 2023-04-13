import { router } from "../trpc";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { stripeRouter } from "./stripe";
import { userRouter } from "./user";

export const appRouter = router({
  stripe: stripeRouter,
  user: userRouter,
  post: postRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
