import { endOfMonth, startOfMonth } from "date-fns";
import { and, desc, eq, gte, isNull, lte, sql } from "drizzle-orm";
import { z } from "zod";
import { paginationInputSchema } from "@/lib/utils";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { budget, category, expense } from "@/server/db/schema";

// Shared schemas
const createExpenseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z.string().min(1, "Amount is required"), // numeric string for Drizzle
  date: z.date(),
  icon: z.string().optional(),
  category_id: z.string().optional(),
  budget_id: z.string().optional(),
});

// Expense Router
export const expenseRouter = createTRPCRouter({
  getAll: privateProcedure
    .input(
      paginationInputSchema.extend({
        from_date: z.date().optional(),
        to_date: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, from_date, to_date } = input;
      const offset = (page - 1) * pageSize;

      // if no date range provided => use current month
      const now = new Date();
      const defaultFromDate = from_date || startOfMonth(now);
      const defaultToDate = to_date || endOfMonth(now);

      const whereConditions = [
        eq(expense.user_id, ctx.user.id),
        isNull(expense.deleted_at),
        gte(expense.date, defaultFromDate),
        lte(expense.date, defaultToDate),
      ];

      const results = await ctx.db
        .select({
          id: expense.id,
          name: expense.name,
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          icon: expense.icon,
          category_id: expense.category_id,
          budget_id: expense.budget_id,
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
        .where(and(...whereConditions))
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

  upsert: privateProcedure
    .input(createExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      // Clean input data
      const cleanInput = {
        ...input,
        category_id: input.category_id === "" ? null : input.category_id,
        budget_id: input.budget_id === "" ? null : input.budget_id,
        icon: input.icon === "" ? null : input.icon,
        description: input.description === "" ? null : input.description,
      };

      // Update existing expense
      if (input.id) {
        const [existingExpense] = await ctx.db
          .update(expense)
          .set(cleanInput)
          .where(
            and(eq(expense.id, input.id), eq(expense.user_id, ctx.user.id))
          )
          .returning();

        return {
          success: true,
          expense: existingExpense,
        };
      }

      // Create new expense
      const [newExpense] = await ctx.db
        .insert(expense)
        .values({
          ...cleanInput,
          user_id: ctx.user.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return {
        success: true,
        expense: newExpense,
      };
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(expense)
        .set({ deleted_at: new Date() })
        .where(
          and(
            eq(expense.id, input.id),
            eq(expense.user_id, ctx.user.id),
            isNull(expense.deleted_at)
          )
        );

      return {
        success: result.length > 0,
      };
    }),

  duplicate: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [existingExpense] = await ctx.db
        .select()
        .from(expense)
        .where(
          and(
            eq(expense.id, input.id),
            eq(expense.user_id, ctx.user.id),
            isNull(expense.deleted_at)
          )
        );

      if (!existingExpense) {
        return { success: false };
      }

      const [newExpense] = await ctx.db
        .insert(expense)
        .values({
          user_id: ctx.user.id,
          name: `${existingExpense.name} (Copy)`,
          description: existingExpense.description
            ? `${existingExpense.description} (Copy)`
            : undefined,
          amount: existingExpense.amount,
          date: existingExpense.date,
          icon: existingExpense.icon,
          category_id: existingExpense.category_id,
          budget_id: existingExpense.budget_id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return {
        success: true,
        expense: newExpense,
      };
    }),
});
