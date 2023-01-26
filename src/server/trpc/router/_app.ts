import { router } from "../trpc";
import { authRouter } from "./auth";
import { guestbookRouter } from "./guestbook";
import { stripeRouter } from "./stripe";

export const appRouter = router({
  stripe: stripeRouter,
  guestbook: guestbookRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
