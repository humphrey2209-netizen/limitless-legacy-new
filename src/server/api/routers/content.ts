import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { siteContent } from "@/server/db/schema";

export const defaultSiteContentItems = [
  {
    key: "brandName",
    label: "Brand Name",
    value: "Limitless Legacy",
    category: "general",
  },
  {
    key: "heroHeadline",
    label: "Hero Headline",
    value: "Personalized Learning Support Designed for Every Child",
    category: "hero",
  },
  {
    key: "heroDescription",
    label: "Hero Description",
    value:
      "Personalized learning plans, educational activities, and parent support tools created to help children build confidence, strengthen skills, and reach their potential.",
    category: "hero",
  },
  {
    key: "aboutSummary",
    label: "About Summary",
    value:
      "Limitless Legacy creates accessible learning opportunities and practical tools for families and educators while honoring every learner’s unique path.",
    category: "about",
  },
  {
    key: "footerDescription",
    label: "Footer Description",
    value: "Inclusive learning support for children, families, and educators.",
    category: "footer",
  },
  {
    key: "contactEmail",
    label: "Contact Email",
    value: "hello.limitlesslegacy@gmail.com",
    category: "contact",
  },
  {
    key: "assessmentDisclaimer",
    label: "Assessment Disclaimer",
    value:
      "This assessment is designed to help families identify supportive learning resources that may benefit their child. It does not diagnose disabilities or replace professional assessments. Every child learns differently, and this tool helps connect families with appropriate support options.",
    category: "assessment",
  },
];

export const contentRouter = createTRPCRouter({
  /**
   * Returns all site content entries as a key-value record and as an array of items.
   */
  getAll: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.select().from(siteContent);

    const map: Record<string, string> = {};
    rows.forEach((row) => {
      map[row.key] = row.value;
    });

    return {
      map,
      items: rows,
    };
  }),

  /**
   * Get a single content value by key.
   */
  getByKey: publicProcedure
    .input(z.object({ key: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, input.key))
        .limit(1);

      return rows[0] ?? null;
    }),

  /**
   * Bulk update content items by passing key-value pairs.
   */
  updateMany: adminProcedure
    .input(z.object({ items: z.record(z.string(), z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const updates = Object.entries(input.items);

      for (const [key, value] of updates) {
        const existing = await ctx.db
          .select()
          .from(siteContent)
          .where(eq(siteContent.key, key))
          .limit(1);

        if (existing.length > 0) {
          await ctx.db
            .update(siteContent)
            .set({ value, updatedAt: new Date() })
            .where(eq(siteContent.key, key));
        } else {
          // Determine label & category fallback
          const defaultRef = defaultSiteContentItems.find((i) => i.key === key);
          await ctx.db.insert(siteContent).values({
            key,
            label: defaultRef?.label ?? key,
            value,
            category: defaultRef?.category ?? "general",
            updatedAt: new Date(),
          });
        }
      }

      return { success: true, count: updates.length };
    }),

  /**
   * Reset content keys back to hardcoded default values.
   */
  resetDefaults: adminProcedure.mutation(async ({ ctx }) => {
    for (const item of defaultSiteContentItems) {
      const existing = await ctx.db
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, item.key))
        .limit(1);

      if (existing.length > 0) {
        await ctx.db
          .update(siteContent)
          .set({ value: item.value, updatedAt: new Date() })
          .where(eq(siteContent.key, item.key));
      } else {
        await ctx.db.insert(siteContent).values({
          key: item.key,
          label: item.label,
          value: item.value,
          category: item.category,
          updatedAt: new Date(),
        });
      }
    }

    return { success: true };
  }),
});
