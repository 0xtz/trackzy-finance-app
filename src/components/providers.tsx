"use client";

import type { ReactNode } from "react";
import { UserProvider } from "@/contexts/user-provider";
import { TRPCReactProvider } from "@/trpc/react";

export default function AppProviders({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <TRPCReactProvider>
      <UserProvider>{children}</UserProvider>
    </TRPCReactProvider>
  );
}
