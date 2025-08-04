"use client";

import { DoorClosed, DoorOpen, LogOut } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useUser } from "@/contexts/user-provider";
import { authClient } from "@/lib/auth/client";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function NavAuthButtons() {
  const { user, isPending } = useUser();

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/signup">
            <DoorClosed className="size-4" />
            Sign up
          </Link>
        </Button>

        <Button asChild size="sm" variant="secondary">
          <Link href="/signin">
            <DoorOpen className="size-4" />
            Sign in
          </Link>
        </Button>
      </div>
    );
  }

  // logged in
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
      <Button
        asChild
        className="w-full transition-all duration-700 md:w-auto"
        size="sm"
        variant="secondary"
      >
        <Link href="/app">
          <DoorOpen className="size-4" />
          Dashboard
        </Link>
      </Button>

      <Button
        className="group w-full transition-all duration-700 md:w-auto"
        onClick={() => {
          toast.promise(authClient.signOut(), {
            loading: "Signing out...",
            success: "Signed out successfully",
            error: "Failed to sign out",
          });
        }}
        size="sm"
        variant="outline"
      >
        <LogOut className="size-4" />
        <span className="group-hover:block md:hidden">Sign out</span>
      </Button>
    </div>
  );
}
