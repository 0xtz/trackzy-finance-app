"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  type ExpenseFormSchema,
  expenseFormSchema,
} from "@/lib/z-schemas/expense";
import { api, type RouterOutputs } from "@/trpc/react";

export default function UpsertExpenseDialog({
  children,
  expense,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: {
  expense?: RouterOutputs["expense"]["getAll"]["items"][number];
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;

  const form = useForm<ExpenseFormSchema>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      name: expense?.name ?? "",
      description: expense?.description ?? "",
      amount: expense?.amount ?? "",
      date: expense?.date ?? new Date(),
      icon: expense?.icon ?? "",
      category_id: expense?.category_id ?? "",
      budget_id: expense?.budget_id ?? "",
    },
  });

  const { data: budgetsData, isLoading: isLoadingBudgets } =
    api.budget.getAll.useQuery(
      { page: 1, pageSize: 100 },
      {
        enabled: open,
        refetchOnWindowFocus: false,
      }
    );

  const budgets = budgetsData?.items ?? [];

  const utils = api.useUtils();
  const { mutateAsync: upsertExpense, isPending } =
    api.expense.upsert.useMutation({
      onSuccess: async (data) => {
        if (!data.success) {
          return;
        }

        await utils.expense.getAll.invalidate();
      },
      onError: (error) => {
        toast.error(`Failed to create expense: ${error.message}`);
      },
    });

  function onSubmit(values: ExpenseFormSchema) {
    const messages = {
      upsert: {
        loading: "Updating expense...",
        success: "Expense updated successfully!",
        error: "Failed to update expense",
      },
      create: {
        loading: "Creating expense...",
        success: "Expense created successfully!",
        error: "Failed to create expense",
      },
    };
    toast.promise(async () => {
      const { success } = await upsertExpense({
        ...values,
        id: expense?.id ?? undefined,
      });

      if (success) {
        form.reset();

        setOpen(false);
      }
    }, messages[expense ? "upsert" : "create"]);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {expense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {expense
              ? "Update your expense details below."
              : "Create a new expense to track your spending."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Coffee at Starbucks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Expense description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        step="0.01"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            variant={"outline"}
                          >
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          captionLayout="dropdown"
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          mode="single"
                          onSelect={field.onChange}
                          selected={field.value}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budget_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Budget (optional)</FormLabel>

                  <Select
                    disabled={isLoadingBudgets}
                    onValueChange={(value: string) =>
                      field.onChange(value === "none" ? "" : value)
                    }
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingBudgets
                              ? "Loading budgets..."
                              : "Select a budget"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingBudgets ? (
                        <SelectItem disabled value="loading">
                          <span className="text-muted-foreground">
                            Loading budgets...
                          </span>
                        </SelectItem>
                      ) : (
                        <>
                          <SelectItem value="none">
                            <span className="text-muted-foreground">
                              No budget
                            </span>
                          </SelectItem>

                          {budgets.map((budget) => (
                            <SelectItem key={budget.id} value={budget.id}>
                              <div className="flex w-full items-center justify-between">
                                <span>{budget.name}</span>
                                <span className="ml-2 text-muted-foreground text-sm">
                                  {formatCurrency(budget.amount)}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>

              <Button disabled={isPending} type="submit">
                {(() => {
                  if (isPending) {
                    return expense ? "Updating..." : "Creating...";
                  }
                  return expense ? "Update Expense" : "Create Expense";
                })()}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
