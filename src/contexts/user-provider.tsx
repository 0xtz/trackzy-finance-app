"use client";
import { createContext, use } from "react";
import { authClient } from "@/lib/auth/client";

export const UserContext = createContext<{
  user: typeof authClient.$Infer.Session.user | undefined;
  isPending: boolean;
}>({
  user: undefined,
  isPending: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <UserContext
      value={{
        user: session?.user,
        isPending,
      }}
    >
      {children}
    </UserContext>
  );
}

export function useUser() {
  const context = use(UserContext);

  if (!context || context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
