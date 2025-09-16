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
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDate } from "@/lib/utils";
import {
  type IncomeFormSchema,
  incomeFormSchema,
} from "@/lib/z-schemas/income";
import { api, type RouterOutputs } from "@/trpc/react";

export default function UpsertIncomeDialog({
  children,
  income,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: {
  income?: RouterOutputs["income"]["getAll"]["items"][number];
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;

  const form = useForm<IncomeFormSchema>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      name: income?.name ?? "",
      description: income?.description ?? "",
      amount: income?.amount ?? "",
      date: income?.date ?? new Date(),
      icon: income?.icon ?? "",
      category_id: income?.category_id ?? "",
    },
  });

  const utils = api.useUtils();
  const { mutateAsync: upsertIncome, isPending } =
    api.income.upsert.useMutation({
      onSuccess: async () => {
        await utils.income.getAll.invalidate();
      },
    });

  function onSubmit(values: IncomeFormSchema) {
    const messages = {
      update: {
        loading: "Updating income...",
        success: "Income updated successfully!",
        error: "Failed to update income",
      },
      create: {
        loading: "Creating income...",
        success: "Income created successfully!",
        error: "Failed to create income",
      },
    };
    toast.promise(
      async () => {
        const { success } = await upsertIncome({
          ...values,
          id: income?.id ?? undefined,
        });

        if (success) {
          form.reset();

          setOpen(false);
        }
      },
      messages[income ? "update" : "create"]
    );
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{income ? "Edit Income" : "Add New Income"}</DialogTitle>
          <DialogDescription>
            {income
              ? "Update your income details below."
              : "Create a new income record to track your earnings."}
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
                    <Input placeholder="e.g. Freelance Project" {...field} />
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
                    <Textarea placeholder="Income description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
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
                              "w-full pl-3 text-left font-normal",
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
                    return income ? "Updating..." : "Creating...";
                  }
                  return income ? "Update Income" : "Create Income";
                })()}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
