import { z } from "zod"

export const budgetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !Number.isNaN(Number(val)), {
      message: "Amount must be a valid number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Amount cannot be negative",
    }),
})

export type BudgetFormSchema = z.infer<typeof budgetFormSchema>
