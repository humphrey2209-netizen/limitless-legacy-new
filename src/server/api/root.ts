import { assessmentRouter } from "@/server/api/routers/assessment";
import { organizationRouter } from "@/server/api/routers/orgrouter";
import { packagesRouter } from "@/server/api/routers/packages";
import { postRouter } from "@/server/api/routers/post";
import { resourcesRouter } from "@/server/api/routers/resources";
import { statsRouter } from "@/server/api/routers/stats";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  packages: packagesRouter,
  resources: resourcesRouter,
  assessment: assessmentRouter,
  org: organizationRouter,
  stats: statsRouter,
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
