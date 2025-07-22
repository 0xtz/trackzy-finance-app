"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BgGradient } from "../common/icons";
import NavAuthButtons from "./nav-auth-buttons";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

const menu = [
  { title: "Home", url: "/" },
  // {
  //   title: "Produit",
  //   url: "#",
  //   items: [
  // {
  //   title: "Contact",
  //   description: "Get all the answers you need right here",
  //   icon: <Zap className="size-5 shrink-0" />,
  //   url: "#",
  // },
  // {
  //   title: "Conditions d'utilisation",
  //   description: "Nos conditions d'utilisation pour utiliser nos services",
  //   icon: <Book className="size-5 shrink-0" />,
  //   url: "/terms-and-conditions",
  // },
  //   ],
  // },
  {
    title: "Pricing",
    url: "#pricing",
  },
];

export default function MainNavbar() {
  return (
    <div className="relative mx-auo w-full py-4">
      <BgGradient />

      <div className="container relative z-1 mx-auto">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link className="flex items-center gap-2" href="/">
              <Logo logo />
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            <NavAuthButtons />
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              aria-label="Home"
              className="flex items-center gap-2"
              href="/"
            >
              <Logo logo />
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  aria-label="Menu"
                  onClick={() => {
                    console.log("clicked");
                  }}
                  size="icon"
                  variant="outline"
                >
                  <Menu className="size-4 text-foreground" />
                </Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link className="flex items-center gap-2" href="/">
                      <Logo fullTitle logo />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex flex-col gap-4">
                    {menu.map((item) => (
                      <Button asChild key={item.title} variant="outline">
                        <Link href={item.url}>{item.title}</Link>
                      </Button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <NavAuthButtons />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderMenuItem(item: MenuItem) {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild className="w-80" key={subItem.title}>
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        asChild
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        <Link href={item.url}>{item.title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function SubMenuLink({ item }: Readonly<{ item: MenuItem }>) {
  return (
    <Link
      className="flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="font-semibold text-sm">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
}
