import { and, desc, eq, sql } from "drizzle-orm";
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

      // Get total count
      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(budget)
        .where(eq(budget.user_id, ctx.user.id));
      const count = countResult[0]?.count ?? 0;

      // Get paginated results
      const items = await ctx.db
        .select()
        .from(budget)
        .where(eq(budget.user_id, ctx.user.id))
        .orderBy(desc(budget.created_at))
        .limit(pageSize)
        .offset(offset);

      return {
        items,
        totalPages: Math.ceil(Number(count) / pageSize),
        currentPage: page,
        totalItems: Number(count),
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
        .delete(budget)
        .where(and(eq(budget.id, input.id), eq(budget.user_id, ctx.user.id)));

      return {
        success: result.length > 0,
      };
    }),
});
