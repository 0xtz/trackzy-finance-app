import { CreditCard } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import DataTableSkeleton from "@/components/common/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { api, HydrateClient } from "@/trpc/server";
import UpsertBudgetDialog from "./_components/add-budget-dialog";
import BudgetDataTable from "./_components/budget-data-table";

export default async function BudgetsPage() {
  await connection();

  void api.budget.getAll.prefetch({
    page: 1,
    pageSize: 100,
  });

  return (
    <HydrateClient>
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">My Budgets</h2>
        <UpsertBudgetDialog>
          <Button size="sm">
            <CreditCard className="size-4" /> New Budget
          </Button>
        </UpsertBudgetDialog>
      </div>

      <Suspense fallback={<DataTableSkeleton columnCount={5} rowCount={5} />}>
        <BudgetDataTable />
      </Suspense>
    </HydrateClient>
  );
}
