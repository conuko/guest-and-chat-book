import { router } from "../trpc";
import { authRouter } from "./auth";
import { guestbookRouter } from "./guestbook";
import { stripeRouter } from "./stripe";
import { userRouter } from "./user";

export const appRouter = router({
  stripe: stripeRouter,
  user: userRouter,
  guestbook: guestbookRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
