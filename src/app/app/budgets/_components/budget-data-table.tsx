"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  DollarSign,
  EllipsisVertical,
  Loader2,
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
import UpsertBudgetDialog from "./add-budget-dialog";

export default function BudgetDataTable() {
  const [data] = api.budget.getAll.useSuspenseQuery({
    page: 1,
    pageSize: 100,
  });

  const columns: ColumnDef<
    RouterOutputs["budget"]["getAll"]["items"][number]
  >[] = [
    {
      header: "Budget Name",
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
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          // TODO: add a tooltip to the description
          <div className="max-w-[300px]">
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
      header: "Created",
      accessorKey: "created_at",
      cell: ({ row }) => {
        return (
          <div className="group flex cursor-default items-center space-x-2 text-muted-foreground text-sm transition-all duration-300 hover:text-primary">
            <Calendar className="size-4 group-hover:scale-105" />
            <span className="">{formatDate(row.original.created_at)}</span>
          </div>
        );
      },
    },
    {
      header: () => <div className="text-end">Actions</div>,
      accessorKey: "actions",
      cell: ({ row }) => <BudgetActions budget={row.original} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data.items}
      emptyState={
        <p className="mt-2 text-muted-foreground text-sm">
          Get started by creating your first budget to track your spending.
        </p>
      }
    />
  );
}

function BudgetActions({
  budget,
}: {
  budget: RouterOutputs["budget"]["getAll"]["items"][number];
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const utils = api.useUtils();
  const { mutateAsync: deleteBudget, isPending: isDeleting } =
    api.budget.delete.useMutation({
      onSuccess: async ({ success }) => {
        if (!success) {
          return;
        }

        await utils.budget.getAll.invalidate();
      },
    });
  const { mutateAsync: duplicateBudget, isPending: isDuplicating } =
    api.budget.duplicate.useMutation({
      onSuccess: async ({ success }) => {
        if (!success) {
          return;
        }

        await utils.budget.getAll.invalidate();
      },
    });

  return (
    <>
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={`Actions for ${budget.id}`}
              size="icon"
              variant="outline"
            >
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Pencil className="size-4" />
              Edit Budget
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={isDuplicating}
              onClick={() => {
                toast.promise(duplicateBudget({ id: budget.id }), {
                  loading: "Duplicating budget...",
                  success: "Budget duplicated successfully!",
                  error: "Failed to duplicate budget",
                });
              }}
            >
              {isDuplicating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <DollarSign className="size-4" />
              )}
              Duplicate Budget
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isDeleting}
              onClick={() => {
                toast.promise(deleteBudget({ id: budget.id }), {
                  loading: "Deleting budget...",
                  success: "Budget deleted successfully!",
                  error: "Failed to delete budget",
                });
              }}
              variant="destructive"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash className="size-4" />
              )}
              Delete Budget
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- */}
      <UpsertBudgetDialog
        budget={budget}
        onOpenChange={setIsEditDialogOpen}
        open={isEditDialogOpen}
      />
    </>
  );
}
