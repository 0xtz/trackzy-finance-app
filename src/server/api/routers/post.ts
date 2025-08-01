import { and, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"
import { paginationInputSchema } from "@/lib/utils"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { budget, category, expense, income } from "@/server/db/schema"

const createExpenseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  date: z.date(),
  icon: z.string().optional(),
  category_id: z.string().optional(),
  budget_id: z.string().optional(),
})

const createIncomeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  date: z.date(),
  icon: z.string().optional(),
  category_id: z.string().optional(),
})

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
  type: z.enum(["expense", "income"]),
})

// Expense Router
export const expenseRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      paginationInputSchema.extend({
        userId: z.string(),
        budgetId: z.string().optional(),
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, userId, budgetId, categoryId } = input
      const offset = (page - 1) * pageSize

      const whereConditions = [eq(expense.user_id, userId)]
      if (budgetId) {
        whereConditions.push(eq(expense.budget_id, budgetId))
      }
      if (categoryId) {
        whereConditions.push(eq(expense.category_id, categoryId))
      }

      // Get total count
      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(expense)
        .where(and(...whereConditions))
      const count = countResult[0]?.count ?? 0

      // Get paginated results with category and budget info
      const items = await ctx.db
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
        })
        .from(expense)
        .leftJoin(category, eq(expense.category_id, category.id))
        .leftJoin(budget, eq(expense.budget_id, budget.id))
        .where(and(...whereConditions))
        .orderBy(desc(expense.date))
        .limit(pageSize)
        .offset(offset)

      return {
        items,
        totalPages: Math.ceil(Number(count) / pageSize),
        currentPage: page,
        totalItems: Number(count),
      }
    }),

  create: publicProcedure
    .input(
      createExpenseSchema.extend({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...data } = input

      const [newExpense] = await ctx.db
        .insert(expense)
        .values({
          ...data,
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()

      return newExpense
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
        .where(and(eq(expense.id, input.id), eq(expense.user_id, input.userId)))
    }),
})

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
      const { page, pageSize, userId, categoryId } = input
      const offset = (page - 1) * pageSize

      const whereConditions = [eq(income.user_id, userId)]
      if (categoryId) {
        whereConditions.push(eq(income.category_id, categoryId))
      }

      // Get total count
      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(income)
        .where(and(...whereConditions))
      const count = countResult[0]?.count ?? 0

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
        .offset(offset)

      return {
        items,
        totalPages: Math.ceil(Number(count) / pageSize),
        currentPage: page,
        totalItems: Number(count),
      }
    }),

  create: publicProcedure
    .input(
      createIncomeSchema.extend({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...data } = input

      const [newIncome] = await ctx.db
        .insert(income)
        .values({
          ...data,
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()

      return newIncome
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
        .where(and(eq(income.id, input.id), eq(income.user_id, input.userId)))
    }),
})

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
      const { page, pageSize, userId, type } = input
      const offset = (page - 1) * pageSize

      const whereConditions = [eq(category.user_id, userId)]
      if (type) {
        whereConditions.push(eq(category.type, type))
      }

      // Get total count
      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(category)
        .where(and(...whereConditions))
      const count = countResult[0]?.count ?? 0

      // Get paginated results
      const items = await ctx.db
        .select()
        .from(category)
        .where(and(...whereConditions))
        .orderBy(desc(category.created_at))
        .limit(pageSize)
        .offset(offset)

      return {
        items,
        totalPages: Math.ceil(Number(count) / pageSize),
        currentPage: page,
        totalItems: Number(count),
      }
    }),

  create: publicProcedure
    .input(
      createCategorySchema.extend({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...data } = input

      const [newCategory] = await ctx.db
        .insert(category)
        .values({
          ...data,
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()

      return newCategory
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
        )
    }),
})
