import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { paginationInputSchema } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { category } from "@/server/db/schema";

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
  type: z.enum(["expense", "income"]),
});

// Category Router
export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      paginationInputSchema.extend({
        userId: z.string(),
        type: z.enum(["expense", "income"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, userId, type } = input;
      const offset = (page - 1) * pageSize;

      const whereConditions = [eq(category.user_id, userId)];
      if (type) {
        whereConditions.push(eq(category.type, type));
      }

      // Get total count
      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(category)
        .where(and(...whereConditions));
      const count = countResult[0]?.count ?? 0;

      // Get paginated results
      const items = await ctx.db
        .select()
        .from(category)
        .where(and(...whereConditions))
        .orderBy(desc(category.created_at))
        .limit(pageSize)
        .offset(offset);

      return {
        items,
        totalPages: Math.ceil(Number(count) / pageSize),
        currentPage: page,
        totalItems: Number(count),
      };
    }),

  create: publicProcedure
    .input(
      createCategorySchema.extend({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...data } = input;

      const [newCategory] = await ctx.db
        .insert(category)
        .values({
          ...data,
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return newCategory;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(category)
        .where(
          and(eq(category.id, input.id), eq(category.user_id, input.userId))
        );
    }),
});
