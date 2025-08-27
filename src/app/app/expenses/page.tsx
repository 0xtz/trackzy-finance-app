import { Receipt } from "lucide-react";
import dynamic from "next/dynamic";
import { connection } from "next/server";
import DateRangePicker from "@/components/common/date-range-picker";
import { Button } from "@/components/ui/button";
import { api, HydrateClient } from "@/trpc/server";
import UpsertExpenseDialog from "./_components/add-expense-dialog";

const ExpenseDataTable = dynamic(
  () => import("./_components/expense-data-table")
);

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

        <div className="flex items-center space-x-2">
          <DateRangePicker />

          <UpsertExpenseDialog>
            <Button size="sm">
              <Receipt className="size-4" /> New Expense
            </Button>
          </UpsertExpenseDialog>
        </div>
      </div>

      <ExpenseDataTable />
    </HydrateClient>
  );
}
