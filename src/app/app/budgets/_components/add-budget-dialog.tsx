"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  type BudgetFormSchema,
  budgetFormSchema,
} from "@/lib/z-schemas/budget";
import { api, type RouterOutputs } from "@/trpc/react";

export default function UpsertBudgetDialog({
  children,
  budget,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: {
  budget?: RouterOutputs["budget"]["getAll"]["items"][number];
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;

  const form = useForm<BudgetFormSchema>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: budget?.name ?? "",
      description: budget?.description ?? "",
      amount: budget?.amount ?? "",
    },
  });

  const utils = api.useUtils();
  const { mutateAsync: upsertBudget, isPending } =
    api.budget.upsert.useMutation({
      onSuccess: async (data) => {
        if (!data.success) {
          return;
        }

        await utils.budget.getAll.invalidate();
      },
      onError: (error) => {
        toast.error(`Failed to create budget: ${error.message}`);
      },
    });

  function onSubmit(values: BudgetFormSchema) {
    const messages = {
      upsert: {
        loading: "Updating budget...",
        success: "Budget updated successfully!",
        error: "Failed to update budget",
      },
      create: {
        loading: "Creating budget...",
        success: "Budget created successfully!",
        error: "Failed to create budget",
      },
    };
    toast.promise(
      async () => {
        const { success } = await upsertBudget({
          ...values,
          id: budget?.id ?? undefined,
        });

        if (success) {
          form.reset();

          setOpen(false);
        }
      },
      messages[budget ? "upsert" : "create"]
    );
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{budget ? "Edit Budget" : "Add New Budget"}</DialogTitle>
          <DialogDescription>
            {budget
              ? "Update your budget details below."
              : "Create a new budget to track your spending limits."}
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
                    <Input
                      disabled={isPending}
                      placeholder="e.g. Monthly groceries"
                      {...field}
                    />
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
                    <Textarea
                      disabled={isPending}
                      placeholder="Budget description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
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

            <div className="flex justify-end gap-2 pt-4">
              <Button
                disabled={isPending}
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>

              <Button disabled={isPending} type="submit">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {(() => {
                  if (isPending) {
                    return budget ? "Updating..." : "Creating...";
                  }
                  return budget ? "Update Budget" : "Create Budget";
                })()}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
