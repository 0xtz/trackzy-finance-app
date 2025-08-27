"use client";

import {
  ChevronRight,
  CreditCard,
  Heart,
  type LucideIcon,
  PieChart,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/lib/config";
import { cn } from "@/lib/utils";
import Logo from "../common/logo";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  main: [
    {
      title: "Dashboard",
      url: "/",
      icon: Wallet,
    },
    {
      title: "Budgets",
      url: "/budgets",
      icon: CreditCard,
    },
    {
      title: "Expenses",
      url: "/expenses",
      icon: TrendingUp,
    },
    {
      title: "Income",
      url: "/income",
      icon: PieChart,
    },
    {
      title: "Wishlist",
      url: "/wishlist",
      icon: Heart,
    },
  ],
  settings: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="inset"
      {...props}
      className="bg-foreground text-background"
    >
      <SidebarHeader className="bg-foreground text-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-transparent"
              size="lg"
            >
              <Link className="space-x-2" href="/app">
                <Logo logo />

                <div className="grid flex-1 text-left text-background text-sm leading-tight">
                  <span className="truncate font-bold text-lg">
                    {APP_CONFIG.name}
                  </span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* --- */}
      <SidebarContent className="bg-foreground text-background">
        <NavMain items={data.main} />
        <NavMain className="mt-auto" items={data.settings} />
      </SidebarContent>

      {/* --- */}
      <SidebarFooter className="bg-foreground text-background">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export function NavMain({
  items,
  className,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  className?: string;
}) {
  const pathname = usePathname();

  const baseUrl = "/app";

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === baseUrl;
    }

    return pathname.startsWith(`${baseUrl}${url}`);
  };

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible asChild defaultOpen={item.isActive} key={item.title}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={
                  "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                }
                isActive={isActive(item.url)}
                tooltip={item.title}
              >
                <Link href={baseUrl + item.url}>
                  <item.icon
                    className={cn(
                      "!size-5",
                      isActive(item.url) && "-rotate-12 transition-all"
                    )}
                  />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>

              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
