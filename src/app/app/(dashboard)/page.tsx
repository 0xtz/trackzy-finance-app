import { AlertCircle } from "lucide-react";
import { GradientBarChart } from "./cards/test";
import { DottedMultiLineChart } from "./cards/test-01";
import { AnimatedHatchedPatternAreaChart } from "./cards/test-02";

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center gap-2 rounded-xl bg-yellow-500/10 p-4 text-yellow-500">
        <AlertCircle className="size-6 text-secondary" />
        <p className="text-primary">
          This is not implemented yet. This is a placeholder for the dashboard.
        </p>
      </div>

      {/* --- */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <DottedMultiLineChart />
        <GradientBarChart />
        <AnimatedHatchedPatternAreaChart />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <GradientBarChart />
      </div>
    </>
  );
}
