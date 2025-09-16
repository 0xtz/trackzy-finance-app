import { DollarSign } from "lucide-react";
import dynamic from "next/dynamic";
import { connection } from "next/server";
import DateRangePicker from "@/components/common/date-range-picker";
import { Button } from "@/components/ui/button";
import { api, HydrateClient } from "@/trpc/server";
import UpsertIncomeDialog from "./_components/add-income-dialog";

const IncomeDataTable = dynamic(
  () => import("./_components/income-data-table")
);

export default async function IncomePage() {
  await connection();

  void api.income.getAll.prefetch({
    page: 1,
    pageSize: 100,
  });

  return (
    <HydrateClient>
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-bold text-xl sm:text-2xl">My Income</h2>

        <div className="flex items-center justify-end gap-2 sm:space-x-2">
          <DateRangePicker />

          <UpsertIncomeDialog>
            <Button size="sm">
              <DollarSign className="size-4" />
              <span className="hidden sm:inline">New Income</span>
            </Button>
          </UpsertIncomeDialog>
        </div>
      </div>

      <IncomeDataTable />
    </HydrateClient>
  );
}
