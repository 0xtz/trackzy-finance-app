import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { budgetRouter } from "./routers/budget";
import { categoryRouter } from "./routers/category";
import { expenseRouter } from "./routers/expense";
import { incomeRouter } from "./routers/income";
import { wishlistRouter } from "./routers/wishlist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  budget: budgetRouter,
  expense: expenseRouter,
  income: incomeRouter,
  category: categoryRouter,
  wishlist: wishlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
