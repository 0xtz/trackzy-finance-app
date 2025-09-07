// Wishlist Schema

import { z } from "zod";

export const wishlistFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  estimated_price: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
  purchased: z.boolean().optional(),
  priority: z.string().optional(),
});

export type WishlistFormSchema = z.infer<typeof wishlistFormSchema>;
