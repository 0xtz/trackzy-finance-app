import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { paginationInputSchema } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { category, income } from "@/server/db/schema";

const createIncomeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  date: z.date(),
  icon: z.string().optional(),
  category_id: z.string().optional(),
});

// Income Router
export const incomeRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      paginationInputSchema.extend({
        userId: z.string(),
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, userId, categoryId } = input;
      const offset = (page - 1) * pageSize;

      const whereConditions = [eq(income.user_id, userId)];
      if (categoryId) {
        whereConditions.push(eq(income.category_id, categoryId));
      }

      // Get total count
      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(income)
        .where(and(...whereConditions));
      const count = countResult[0]?.count ?? 0;

      // Get paginated results with category info
      const items = await ctx.db
        .select({
          id: income.id,
          name: income.name,
          description: income.description,
          amount: income.amount,
          date: income.date,
          icon: income.icon,
          created_at: income.created_at,
          updated_at: income.updated_at,
          category: {
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
          },
        })
        .from(income)
        .leftJoin(category, eq(income.category_id, category.id))
        .where(and(...whereConditions))
        .orderBy(desc(income.date))
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
      createIncomeSchema.extend({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...data } = input;

      const [newIncome] = await ctx.db
        .insert(income)
        .values({
          ...data,
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return newIncome;
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
        .delete(income)
        .where(and(eq(income.id, input.id), eq(income.user_id, input.userId)));
    }),
});
