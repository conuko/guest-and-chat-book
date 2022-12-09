import { router } from "../trpc";
import { authRouter } from "./auth";
import { guestbookRouter } from "./guestbook";

export const appRouter = router({
  guestbook: guestbookRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
