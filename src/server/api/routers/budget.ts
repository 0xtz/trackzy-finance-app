import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import { paginationInputSchema } from "@/lib/utils";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { budget } from "@/server/db/schema";

// Shared schemas
const createBudgetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z.string().min(1, "Amount is required"), // numeric string for Drizzle
});

// Budget Router
export const budgetRouter = createTRPCRouter({
  getAll: privateProcedure
    .input(paginationInputSchema.extend({}))
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;

      const results = await ctx.db
        .select({
          id: budget.id,
          name: budget.name,
          description: budget.description,
          amount: budget.amount,
          user_id: budget.user_id,
          created_at: budget.created_at,
          updated_at: budget.updated_at,
          totalCount: sql<number>`count(*) over()`,
        })
        .from(budget)
        .where(eq(budget.user_id, ctx.user.id))
        .orderBy(desc(budget.created_at))
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
    .input(createBudgetSchema)
    .mutation(async ({ ctx, input }) => {
      // Update existing budget
      if (input.id) {
        const [existingBudget] = await ctx.db
          .update(budget)
          .set(input)
          .where(and(eq(budget.id, input.id), eq(budget.user_id, ctx.user.id)))
          .returning();

        return {
          success: true,
          budget: existingBudget,
        };
      }

      // Create new budget
      const [newBudget] = await ctx.db
        .insert(budget)
        .values({
          ...input,
          user_id: ctx.user.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return {
        success: true,
        budget: newBudget,
      };
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(budget)
        .set({ deleted_at: new Date() })
        .where(
          and(
            eq(budget.id, input.id),
            eq(budget.user_id, ctx.user.id),
            isNull(budget.deleted_at)
          )
        );

      return {
        success: result.length > 0,
      };
    }),

  duplicate: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [existingBudget] = await ctx.db
        .select()
        .from(budget)
        .where(and(eq(budget.id, input.id), eq(budget.user_id, ctx.user.id)));

      if (!existingBudget) {
        return { success: false };
      }

      const [newBudget] = await ctx.db
        .insert(budget)
        .values({
          user_id: ctx.user.id,
          name: `${existingBudget.name} (Copy)`,
          description: `${existingBudget.description} (Copy)`,
          amount: existingBudget.amount,

          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return {
        success: true,
        budget: newBudget,
      };
    }),
});
