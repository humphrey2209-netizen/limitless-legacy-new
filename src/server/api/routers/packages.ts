import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { packages } from "@/server/db/schema";

const packageInputSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().optional(),
  price: z.number().int().min(0, "Price must be a non-negative number"),
  billingCycle: z
    .enum(["one_time", "monthly", "yearly"])
    .default("one_time"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  purchaseUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const packagesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.packages.findMany({
      orderBy: (packages, { asc }) => [asc(packages.displayOrder)],
    });
  }),

  create: protectedProcedure
    .input(packageInputSchema)
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();
      await ctx.db.insert(packages).values({
        id,
        ...input,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        purchaseUrl: input.purchaseUrl || null,
        description: input.description ?? null,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        data: packageInputSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(packages)
        .set({
          ...input.data,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          purchaseUrl: input.data.purchaseUrl || null,
          description: input.data.description ?? null,
          updatedAt: new Date(),
        })
        .where(eq(packages.id, input.id));
      return { id: input.id };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(packages).where(eq(packages.id, input.id));
      return { id: input.id };
    }),
});
