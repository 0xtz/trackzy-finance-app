import { connection } from "next/server";
import { api } from "@/trpc/server";

export default async function ExpensesPage() {
  await connection();

  void api.expense.getAll.prefetch({
    page: 1,
    pageSize: 100,
  });

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </>
  );
}
