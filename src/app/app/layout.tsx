import { cookies } from "next/headers";
import FeedbackButton from "@/components/common/feedback-button";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />

      <SidebarInset>
        <header className="flex shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center justify-between gap-2 px-4 py-2">
            <SidebarTrigger className="-ml-1" />

            {/* <Separator
              className="mr-2 data-[orientation=vertical]:h-4"
              orientation="vertical"
            /> */}

            <FeedbackButton />
          </div>
        </header>

        {/* --- */}
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
