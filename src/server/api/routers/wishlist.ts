import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import { WISHLIST_PRIORITY } from "@/lib/enums";
import { paginationInputSchema } from "@/lib/utils";
import { wishlistFormSchema } from "@/lib/z-schemas/wishlist";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { wishlist } from "@/server/db/schema";

// Wishlist Router
export const wishlistRouter = createTRPCRouter({
  getAll: privateProcedure
    .input(
      paginationInputSchema.extend({
        purchased: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, purchased } = input;
      const offset = (page - 1) * pageSize;

      const whereConditions = [
        eq(wishlist.user_id, ctx.user.id),
        isNull(wishlist.deleted_at),
        purchased !== undefined ? eq(wishlist.purchased, purchased) : undefined,
      ];

      const results = await ctx.db
        .select({
          id: wishlist.id,
          name: wishlist.name,
          description: wishlist.description,
          estimated_price: wishlist.estimated_price,
          url: wishlist.url,
          image: wishlist.image,
          purchased: wishlist.purchased,
          priority: wishlist.priority,
          created_at: wishlist.created_at,
          updated_at: wishlist.updated_at,
          totalCount: sql<number>`count(*) over()`,
        })
        .from(wishlist)
        .where(and(...whereConditions))
        .orderBy(desc(wishlist.created_at))
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
    .input(wishlistFormSchema)
    .mutation(async ({ ctx, input }) => {
      // Clean input data
      const cleanInput = {
        ...input,
        estimated_price:
          input.estimated_price === "" ? null : input.estimated_price,
        url: input.url === "" ? null : input.url,
        image: input.image === "" ? null : input.image,
        description: input.description === "" ? null : input.description,
        purchased: input.purchased ?? false,
        priority: input.priority ?? WISHLIST_PRIORITY.LOW.label,
      };

      // Update existing wishlist item
      if (input.id) {
        const [existingItem] = await ctx.db
          .update(wishlist)
          .set(cleanInput)
          .where(
            and(eq(wishlist.id, input.id), eq(wishlist.user_id, ctx.user.id))
          )
          .returning();

        return {
          success: true,
          wishlist: existingItem,
        };
      }

      // Create new wishlist item
      const [newItem] = await ctx.db
        .insert(wishlist)
        .values({
          ...cleanInput,
          user_id: ctx.user.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return {
        success: true,
        wishlist: newItem,
      };
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(wishlist)
        .set({ deleted_at: new Date() })
        .where(
          and(
            eq(wishlist.id, input.id),
            eq(wishlist.user_id, ctx.user.id),
            isNull(wishlist.deleted_at)
          )
        );

      return {
        success: true,
        error: null,
      };
    }),

  togglePurchased: privateProcedure
    .input(z.object({ id: z.string(), purchased: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(wishlist)
        .set({
          purchased: input.purchased,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(wishlist.id, input.id),
            eq(wishlist.user_id, ctx.user.id),
            isNull(wishlist.deleted_at)
          )
        );

      return {
        success: result.length > 0,
      };
    }),
});
