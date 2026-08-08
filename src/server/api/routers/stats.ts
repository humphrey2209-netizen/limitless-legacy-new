import { count, eq } from "drizzle-orm";

import { auth } from "@/server/better-auth";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  assessmentSubmissions,
  contactSubmissions,
  member,
  packages,
  resourceDownloads,
  resources,
  user,
} from "@/server/db/schema";

export const statsRouter = createTRPCRouter({
  /**
   * Real overview metrics for the main Admin Dashboard (/admin).
   */
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    const activeMember = await auth.api.getActiveMember({
      headers: ctx.headers,
    });
    const isAdmin = activeMember.role === "admin";

    const [userResult] = await ctx.db.select({ count: count() }).from(user);
    const [packageResult] = await ctx.db
      .select({ count: count() })
      .from(packages)
      .where(eq(packages.isActive, true));
    const [totalPackagesResult] = await ctx.db
      .select({ count: count() })
      .from(packages);
    const [assessmentResult] = isAdmin
      ? await ctx.db.select({ count: count() }).from(assessmentSubmissions)
      : await ctx.db
          .select({ count: count() })
          .from(assessmentSubmissions)
          .where(eq(assessmentSubmissions.userId, ctx.session.user.id));
    const [resourceResult] = await ctx.db
      .select({ count: count() })
      .from(resources);
    const [downloadResult] = await ctx.db
      .select({ count: count() })
      .from(resourceDownloads);
    const [contactResult] = await ctx.db
      .select({ count: count() })
      .from(contactSubmissions);

    const recentSubmissions = await ctx.db.query.assessmentSubmissions.findMany(
      {
        limit: 5,
        orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
        where: isAdmin
          ? undefined
          : (submissions, { eq }) =>
              eq(submissions.userId, ctx.session.user.id),
        with: {
          user: true,
        },
      },
    );

    const recentUsers = await ctx.db.query.user.findMany({
      limit: 5,
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    return {
      totalUsers: userResult?.count ?? 0,
      activePackages: packageResult?.count ?? 0,
      totalPackages: totalPackagesResult?.count ?? 0,
      completedAssessments: assessmentResult?.count ?? 0,
      totalResources: resourceResult?.count ?? 0,
      totalDownloads: downloadResult?.count ?? 0,
      contactInquiries: contactResult?.count ?? 0,
      recentSubmissions,
      recentUsers,
    };
  }),

  /**
   * Real analytics data for the Admin Analytics page (/admin/analytics).
   */
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    const [assessmentResult] = await ctx.db
      .select({ count: count() })
      .from(assessmentSubmissions);
    const [downloadResult] = await ctx.db
      .select({ count: count() })
      .from(resourceDownloads);
    const [userResult] = await ctx.db.select({ count: count() }).from(user);

    const submissions = await ctx.db.select().from(assessmentSubmissions);

    const ageCounts: Record<string, number> = {};
    const supportAreaCounts: Record<string, number> = {};

    submissions.forEach((sub) => {
      if (sub.childAge) {
        ageCounts[sub.childAge] = (ageCounts[sub.childAge] ?? 0) + 1;
      }
      if (Array.isArray(sub.supportAreas)) {
        sub.supportAreas.forEach((area) => {
          supportAreaCounts[area] = (supportAreaCounts[area] ?? 0) + 1;
        });
      }
    });

    const allResources = await ctx.db.select().from(resources);
    const allPackages = await ctx.db.select().from(packages);
    const orgMembers = await ctx.db.select().from(member);

    const roleCounts: Record<string, number> = {};
    orgMembers.forEach((m) => {
      roleCounts[m.role] = (roleCounts[m.role] ?? 0) + 1;
    });

    return {
      totalAssessments: assessmentResult?.count ?? 0,
      totalDownloads: downloadResult?.count ?? 0,
      totalUsers: userResult?.count ?? 0,
      ageCounts,
      supportAreaCounts,
      totalResourcesCount: allResources.length,
      totalPackagesCount: allPackages.length,
      roleCounts,
    };
  }),
});
