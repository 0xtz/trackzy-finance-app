"use client";

import type { ReactNode } from "react";
import { TRPCReactProvider } from "@/trpc/react";

export default function AppProviders({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <TRPCReactProvider>{children}</TRPCReactProvider>;
}
