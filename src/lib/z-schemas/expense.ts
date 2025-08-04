import { z } from "zod";

export const expenseFormSchema = z.object({
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
  date: z.date({
    required_error: "Date is required",
  }),
  icon: z.string().optional(),
  category_id: z.string().optional(),
  budget_id: z.string().optional(),
});

export type ExpenseFormSchema = z.infer<typeof expenseFormSchema>;
