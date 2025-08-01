import { type ClassValue, clsx } from "clsx";
import { format, isValid, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// pagination helper
export function paginate<T>(items: T[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return items.slice(startIndex, endIndex);
}

export function paginateSchema<T>(items: T[], page: number, pageSize: number) {
  return {
    items: paginate(items, page, pageSize),
    totalPages: Math.ceil(items.length / pageSize),
    currentPage: page,
  };
}

// tRPC pagination schemas
export const paginationInputSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

export const createPaginatedResponse = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    items: z.array(itemSchema),
    totalPages: z.number(),
    currentPage: z.number(),
    totalItems: z.number(),
  });

export type PaginationInput = z.infer<typeof paginationInputSchema>;

// ----------------------------
// Formatters
// ----------------------------

export function formatCurrency(
  amount: number,
  showSymbol = false,
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat("ma-MA", {
    style: "currency",
    currency: "MAD",
    ...(showSymbol ? { currencyDisplay: "symbol" } : {}),
    ...options,
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) {
    return "";
  }

  let dateObj: Date;

  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === "string") {
    // Try to parse ISO string, fallback to Date constructor
    dateObj = parseISO(date);
    if (!isValid(dateObj)) {
      dateObj = new Date(date);
    }
  } else {
    return "";
  }

  if (!isValid(dateObj)) {
    return "";
  }

  // Default format: "MMM d, yyyy"
  return format(dateObj, "MMM d, yyyy");
}
