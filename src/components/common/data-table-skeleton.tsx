/** biome-ignore-all lint/suspicious/noArrayIndexKey: skip */
"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
  className?: string;
}

export default function DataTableSkeleton({
  columnCount,
  rowCount = 5,
  className = "",
}: DataTableSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Header Skeleton */}
      <div className="rounded-md border">
        <div className="border-b p-4">
          <div
            className={"grid gap-4"}
            style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
          >
            {Array.from({ length: columnCount }).map((_, num) => (
              <Skeleton className="h-4 w-full" key={`header-${num}`} />
            ))}
          </div>
        </div>

        {/* Table Rows Skeleton */}
        {Array.from({ length: rowCount }, (_, i) => i + 1).map((num) => (
          <div
            className="border-b p-4 last:border-b-0"
            key={`skeleton-row-${num}`}
          >
            <div
              className={"grid gap-4"}
              style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
            >
              {Array.from({ length: columnCount }).map((_, num2) => (
                <Skeleton className="h-4 w-full" key={`cell-${num2}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
