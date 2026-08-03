import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { assessmentSubmissions } from "@/server/db/schema";

const assessmentSubmissionInputSchema = z.object({
  childAge: z.string().optional(),
  childGrade: z.string().optional(),
  supportAreas: z.array(z.string()).default([]),
  challenges: z.array(z.string()).optional(),
  preferences: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
  recommendedPackageIds: z.array(z.string()).optional(),
  recommendedResourceIds: z.array(z.string()).optional(),
});

export const assessmentRouter = createTRPCRouter({
  submit: publicProcedure
    .input(assessmentSubmissionInputSchema)
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();
      const userId = ctx.session?.user?.id ?? null;

      await ctx.db.insert(assessmentSubmissions).values({
        id,
        userId,
        childAge: input.childAge ?? null,
        childGrade: input.childGrade ?? null,
        supportAreas: input.supportAreas,
        challenges: input.challenges ?? [],
        preferences: input.preferences ?? [],
        goals: input.goals ?? [],
        recommendedPackageIds: input.recommendedPackageIds ?? [],
        recommendedResourceIds: input.recommendedResourceIds ?? [],
      });

      return { id };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const submissions = await ctx.db.query.assessmentSubmissions.findMany({
      orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
      with: {
        user: true,
      },
    });
    return submissions;
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(assessmentSubmissions)
        .where(eq(assessmentSubmissions.id, input.id));
      return { id: input.id };
    }),
});
