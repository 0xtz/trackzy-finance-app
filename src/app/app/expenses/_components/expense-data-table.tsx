"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  Copy,
  EllipsisVertical,
  Pencil,
  Trash,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DataTable from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import { api, type RouterOutputs } from "@/trpc/react";
import UpsertExpenseDialog from "./add-expense-dialog";

export default function ExpenseDataTable() {
  const [data] = api.expense.getAll.useSuspenseQuery({
    page: 1,
    pageSize: 100,
  });

  const columns: ColumnDef<
    RouterOutputs["expense"]["getAll"]["items"][number]
  >[] = [
    {
      header: "Expense Name",
      accessorKey: "name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-foreground">
              {row.original.name}
            </span>
          </div>
        );
      },
    },
    {
      header: () => {
        return <div className="text-center">Amount (MAD)</div>;
      },
      accessorKey: "amount",
      cell: ({ row }) => {
        const amount = Number(row.original.amount);
        return (
          <div className="flex items-center justify-center">
            <Badge className="font-mono" variant="outline">
              {formatCurrency(amount)}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => {
        const category = row.original.category;
        return (
          <div className="flex items-center space-x-2">
            {category ? (
              <>
                {category.icon && <span>{category.icon}</span>}
                <span
                  className="text-sm"
                  style={{ color: category.color ?? undefined }}
                >
                  {category.name}
                </span>
              </>
            ) : (
              <X className="size-4 text-muted-foreground" />
            )}
          </div>
        );
      },
    },
    {
      header: "Budget",
      accessorKey: "budget",
      cell: ({ row }) => {
        const budget = row.original.budget;
        return (
          <div className="max-w-[150px]">
            {budget ? (
              <Badge className="truncate" variant="outline">
                {budget.name}
              </Badge>
            ) : (
              <X className="size-4 text-muted-foreground" />
            )}
          </div>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          <div className="max-w-[200px]">
            {description ? (
              <p className="truncate text-muted-foreground text-sm">
                {description}
              </p>
            ) : (
              <X className="size-4 text-muted-foreground" />
            )}
          </div>
        );
      },
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => {
        return (
          <div className="group flex cursor-default items-center space-x-2 text-muted-foreground text-sm transition-all duration-300 hover:text-primary">
            <Calendar className="size-4 group-hover:scale-105" />
            <span>{formatDate(row.original.date)}</span>
          </div>
        );
      },
    },
    {
      header: () => <div className="text-end">Actions</div>,
      accessorKey: "actions",
      cell: ({ row }) => <ExpenseActions expense={row.original} />,
    },
  ];

  // TODO : empty state

  return <DataTable columns={columns} data={data.items} />;
}

function ExpenseActions({
  expense,
}: {
  expense: RouterOutputs["expense"]["getAll"]["items"][number];
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const utils = api.useUtils();
  const { mutateAsync: deleteExpense, isPending: isDeleting } =
    api.expense.delete.useMutation({
      onSuccess: async ({ success }) => {
        if (!success) {
          return;
        }

        await utils.expense.getAll.invalidate();
      },
    });
  const { mutateAsync: duplicateExpense, isPending: isDuplicating } =
    api.expense.duplicate.useMutation({
      onSuccess: async ({ success }) => {
        if (!success) {
          return;
        }

        await utils.expense.getAll.invalidate();
      },
    });

  return (
    <>
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={`Actions for ${expense.id}`}
              size="icon"
              variant="outline"
            >
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Pencil className="size-4" />
              Edit Expense
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={isDuplicating}
              onClick={() => {
                toast.promise(duplicateExpense({ id: expense.id }), {
                  loading: "Duplicating expense...",
                  success: "Expense duplicated successfully!",
                  error: "Failed to duplicate expense",
                });
              }}
            >
              <Copy className="size-4" />
              Duplicate Expense
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isDeleting}
              onClick={() => {
                toast.promise(deleteExpense({ id: expense.id }), {
                  loading: "Deleting expense...",
                  success: "Expense deleted successfully!",
                  error: "Failed to delete expense",
                });
              }}
              variant="destructive"
            >
              <Trash className="size-4" />
              Delete Expense
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- */}
      <UpsertExpenseDialog
        expense={expense}
        onOpenChange={setIsEditDialogOpen}
        open={isEditDialogOpen}
      />
    </>
  );
}
