import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { resources } from "@/server/db/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const resourceInputSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  fileUrl: z.string().url("Valid File URL is required"),
  coverImageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

export const resourcesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.resources.findMany({
      orderBy: (resources, { asc }) => [asc(resources.displayOrder)],
    });
  }),

  getSignedUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        prefix: z.string().default("resources"),
      }),
    )
    .mutation(async ({ input }) => {
      const supabase = createSupabaseAdminClient();
      const fileExt = input.filename.split(".").pop();
      const cleanName = input.filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const path = `${input.prefix}/${Date.now()}_${cleanName}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("limitless-legacy")
        .createSignedUploadUrl(path);

      if (error || !data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create signed upload URL: ${error?.message}`,
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from("limitless-legacy")
        .getPublicUrl(path);

      return {
        token: data.token,
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
      };
    }),

  create: protectedProcedure
    .input(resourceInputSchema)
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();
      await ctx.db.insert(resources).values({
        id,
        ...input,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        coverImageUrl: input.coverImageUrl || null,
        downloadCount: 0,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        data: resourceInputSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(resources)
        .set({
          ...input.data,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          coverImageUrl: input.data.coverImageUrl || null,
          updatedAt: new Date(),
        })
        .where(eq(resources.id, input.id));
      return { id: input.id };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(resources).where(eq(resources.id, input.id));
      return { id: input.id };
    }),
});
