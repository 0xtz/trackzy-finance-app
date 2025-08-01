import { GradientBarChart } from "./cards/test";
import { DottedMultiLineChart } from "./cards/test-01";
import { AnimatedHatchedPatternAreaChart } from "./cards/test-02";

export default function DashboardPage() {
  return (
    <>
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
