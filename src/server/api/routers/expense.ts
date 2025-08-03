import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { paginationInputSchema } from "@/lib/utils";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { budget, category, expense } from "@/server/db/schema";

const createExpenseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  date: z.date(),
  icon: z.string().optional(),
  category_id: z.string().optional(),
  budget_id: z.string().optional(),
});

// Expense Router
export const expenseRouter = createTRPCRouter({
  getAll: privateProcedure
    .input(paginationInputSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;

      const results = await ctx.db
        .select({
          id: expense.id,
          name: expense.name,
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          icon: expense.icon,
          created_at: expense.created_at,
          updated_at: expense.updated_at,
          category: {
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
          },
          budget: {
            id: budget.id,
            name: budget.name,
          },
          totalCount: sql<number>`count(*) over()`,
        })
        .from(expense)
        .leftJoin(category, eq(expense.category_id, category.id))
        .leftJoin(budget, eq(expense.budget_id, budget.id))
        .where(eq(expense.user_id, ctx.user.id))
        .orderBy(desc(expense.date))
        .limit(pageSize)
        .offset(offset);

      const items = results.map(({ totalCount, ...item }) => item);
      const totalItems = Number(results[0]?.totalCount ?? 0);

      return {
        items,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        totalItems,
      };
    }),

  create: publicProcedure
    .input(
      createExpenseSchema.extend({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...data } = input;

      const [newExpense] = await ctx.db
        .insert(expense)
        .values({
          ...data,
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return newExpense;
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
        .delete(expense)
        .where(
          and(eq(expense.id, input.id), eq(expense.user_id, input.userId))
        );
    }),
});
