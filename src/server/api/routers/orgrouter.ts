import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { orgMember, organization, user } from "@/server/db/schema";

const ORG_SLUG = "limitless-legacy";

/** Allowed org roles */
const orgRoles = ["owner", "admin", "member", "customer"] as const;
type OrgRole = (typeof orgRoles)[number];



export const organizationRouter = createTRPCRouter({
  /**
   * Returns the Limitless Legacy organization row.
   */
  getOrg: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(organization)
      .where(eq(organization.slug, ORG_SLUG))
      .limit(1);
    return rows[0] ?? null;
  }),

  /**
   * Lists all registered users, annotated with their org role (null = not a member).
   */
  listUsers: protectedProcedure.query(async ({ ctx }) => {
    const orgRows = await ctx.db
      .select()
      .from(organization)
      .where(eq(organization.slug, ORG_SLUG))
      .limit(1);
    const org = orgRows[0] ?? null;

    const users = await ctx.db
      .select()
      .from(user)
      .orderBy(user.createdAt);

    if (!org) {
      return users.map((u) => ({
        ...u,
        orgRole: null as OrgRole | null,
        memberId: null as string | null,
      }));
    }

    const members = await ctx.db
      .select()
      .from(orgMember)
      .where(eq(orgMember.organizationId, org.id));

    const memberMap = new Map(members.map((m) => [m.userId, m]));

    return users.map((u) => {
      const m = memberMap.get(u.id);
      return {
        ...u,
        orgRole: (m?.role ?? null) as OrgRole | null,
        memberId: m?.id ?? null,
      };
    });
  }),

  /**
   * Add a user to the org or update their existing role.
   */
  setMemberRole: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        role: z.enum(orgRoles),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const orgRows = await ctx.db
        .select()
        .from(organization)
        .where(eq(organization.slug, ORG_SLUG))
        .limit(1);

      const org = orgRows[0];
      if (!org) {
        throw new Error("Organization not found. Run `pnpm db:seed` first.");
      }

      const existing = await ctx.db
        .select()
        .from(orgMember)
        .where(eq(orgMember.userId, input.userId))
        .limit(1);

      if (existing.length > 0) {
        await ctx.db
          .update(orgMember)
          .set({ role: input.role })
          .where(eq(orgMember.userId, input.userId));
        return { action: "updated" as const };
      }

      await ctx.db.insert(orgMember).values({
        id: crypto.randomUUID(),
        organizationId: org.id,
        userId: input.userId,
        role: input.role,
        createdAt: new Date(),
      });

      return { action: "added" as const };
    }),

  /**
   * Remove a user from the org (they remain a registered user).
   */
  removeMember: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(orgMember)
        .where(eq(orgMember.userId, input.userId));
      return { success: true };
    }),
});
