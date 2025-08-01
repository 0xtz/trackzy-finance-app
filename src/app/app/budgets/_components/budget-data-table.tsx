"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, DollarSign, Calendar, FileText } from "lucide-react";
import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, type RouterOutputs } from "@/trpc/react";

export default function BudgetDataTable() {
  const [data] = api.budget.getAll.useSuspenseQuery({
    page: 1,
    pageSize: 100,
  });

  const columns: ColumnDef<
    RouterOutputs["budget"]["getAll"]["items"][number]
  >[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        return <div className="font-bold">{row.original.name}</div>;
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => {
        return <div>{row.original.amount}</div>;
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => {
        return <div>{row.original.description}</div>;
      },
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => {
        return <div>{row.original.created_at.toLocaleDateString()}</div>;
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <Button
              aria-label={`Actions for ${row.original.id}`}
              size="icon"
              variant="outline"
            >
              <EllipsisVertical />
            </Button>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data.items} />;
}
