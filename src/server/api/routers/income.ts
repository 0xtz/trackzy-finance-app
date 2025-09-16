import { endOfMonth, startOfMonth } from "date-fns";
import { and, desc, eq, gte, isNull, lte, sql } from "drizzle-orm";
import { z } from "zod";
import { paginationInputSchema } from "@/lib/utils";
import { incomeFormSchema } from "@/lib/z-schemas/income";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { category, income } from "@/server/db/schema";

// Income Router
export const incomeRouter = createTRPCRouter({
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
        eq(income.user_id, ctx.user.id),
        isNull(income.deleted_at),
        gte(income.date, defaultFromDate),
        lte(income.date, defaultToDate),
      ];

      const results = await ctx.db
        .select({
          id: income.id,
          name: income.name,
          description: income.description,
          amount: income.amount,
          date: income.date,
          icon: income.icon,
          category_id: income.category_id,
          created_at: income.created_at,
          updated_at: income.updated_at,
          category: {
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
          },
          totalCount: sql<number>`count(*) over()`,
        })
        .from(income)
        .leftJoin(category, eq(income.category_id, category.id))
        .where(and(...whereConditions))
        .orderBy(desc(income.date))
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
    .input(incomeFormSchema)
    .mutation(async ({ ctx, input }) => {
      // Clean input data
      const cleanInput = {
        ...input,
        category_id: input.category_id === "" ? null : input.category_id,
        icon: input.icon === "" ? null : input.icon,
        description: input.description === "" ? null : input.description,
      };

      // Update existing income
      if (input.id) {
        const [existingIncome] = await ctx.db
          .update(income)
          .set(cleanInput)
          .where(and(eq(income.id, input.id), eq(income.user_id, ctx.user.id)))
          .returning();

        return {
          success: true,
          income: existingIncome,
        };
      }

      // Create new income
      const [newIncome] = await ctx.db
        .insert(income)
        .values({
          ...cleanInput,
          user_id: ctx.user.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return {
        success: true,
        income: newIncome,
      };
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(income)
        .set({ deleted_at: new Date() })
        .where(
          and(
            eq(income.id, input.id),
            eq(income.user_id, ctx.user.id),
            isNull(income.deleted_at)
          )
        );

      return {
        success: true,
        error: null,
      };
    }),

  duplicate: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [existingIncome] = await ctx.db
        .select()
        .from(income)
        .where(
          and(
            eq(income.id, input.id),
            eq(income.user_id, ctx.user.id),
            isNull(income.deleted_at)
          )
        );

      if (!existingIncome) {
        console.error("🚀 ~ existingIncome:", existingIncome);
        return { success: false };
      }

      const [newIncome] = await ctx.db
        .insert(income)
        .values({
          user_id: ctx.user.id,
          name: `${existingIncome.name} (Copy)`,
          description: existingIncome.description
            ? `${existingIncome.description} (Copy)`
            : undefined,
          amount: existingIncome.amount,
          date: existingIncome.date,
          icon: existingIncome.icon,
          category_id: existingIncome.category_id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return {
        success: true,
        income: newIncome,
      };
    }),
});
