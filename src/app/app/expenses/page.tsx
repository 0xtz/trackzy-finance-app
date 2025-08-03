import { Receipt } from "lucide-react";
import { connection } from "next/server";
import { Button } from "@/components/ui/button";
import { api, HydrateClient } from "@/trpc/server";
import UpsertExpenseDialog from "./_components/add-expense-dialog";
import ExpenseDataTable from "./_components/expense-data-table";

export default async function ExpensesPage() {
  await connection();

  void api.expense.getAll.prefetch({
    page: 1,
    pageSize: 100,
  });

  return (
    <HydrateClient>
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">My Expenses</h2>
        <UpsertExpenseDialog>
          <Button size="sm">
            <Receipt className="size-4" /> New Expense
          </Button>
        </UpsertExpenseDialog>
      </div>

      <ExpenseDataTable />
    </HydrateClient>
  );
}
